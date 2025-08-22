import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { CalculationRequest, CalculationResult, FormState, FileInfo, ChatMessage, Product } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
    responseMimeType: "application/json",
};

const safeJsonParse = (jsonString: string) => {
    try {
        const cleanedString = jsonString.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        return JSON.parse(cleanedString);
    } catch (error) {
        console.error("Failed to parse JSON response from Gemini:", jsonString);
        console.error("Parse Error:", error);
        throw new Error("Sun'iy intellekt xizmatidan noto'g'ri formatdagi javob keldi.");
    }
};

const calculationResultSchema = {
    type: "OBJECT",
    properties: {
        itemsPerSheet: { type: "STRING" },
        totalSheets: { type: "STRING" },
        materialCost: { type: "STRING" },
        printingCost: { type: "STRING" },
        postPressCost: { type: "STRING" },
        totalCost: { type: "STRING" },
        calculationExplanation: { type: "STRING" },
        unfoldedDimensions: { type: "OBJECT", nullable: true, properties: { width: { type: "STRING" }, height: { type: "STRING" } } },
        nestingLayout: { type: "ARRAY", items: { type: "OBJECT", properties: { x: { type: "STRING" }, y: { type: "STRING" }, width: { type: "STRING" }, height: { type: "STRING" } } } },
        advice: { type: "STRING" },
        preflightCheck: { type: "OBJECT", nullable: true, properties: { status: { type: "STRING", enum: ['OK', 'WARNING', 'ERROR']}, message: { type: "STRING" } } },
        requestData: {
          type: "OBJECT",
          properties: { 
            productType: { type: "STRING" }, 
            width: { type: "STRING" }, 
            height: { type: "STRING" }, 
            depth: { type: "STRING", nullable: true }, 
            material: { type: "STRING" }, 
            quantity: { type: "STRING" }, 
            color: { type: "STRING" }, 
            lamination: { type: "STRING" }, 
            urgency: { type: "STRING", nullable: true }, 
            pageCount: { type: "STRING", nullable: true }, 
            coverMaterial: { type: "STRING", nullable: true }, 
            innerMaterial: { type: "STRING", nullable: true }, 
            bindingType: { type: "STRING", nullable: true }
          },
          required: ["productType", "quantity"]
        }
    },
    required: ['totalCost', 'calculationExplanation', 'requestData']
};

const convertResultStringsToNumbers = (result: any): CalculationResult => {
    return {
        ...result,
        itemsPerSheet: Number(result.itemsPerSheet) || 0,
        totalSheets: Number(result.totalSheets) || 0,
        materialCost: Number(result.materialCost) || 0,
        printingCost: Number(result.printingCost) || 0,
        postPressCost: Number(result.postPressCost) || 0,
        totalCost: Number(result.totalCost) || 0,
        unfoldedDimensions: result.unfoldedDimensions ? {
            width: Number(result.unfoldedDimensions.width) || 0,
            height: Number(result.unfoldedDimensions.height) || 0,
        } : null,
        nestingLayout: (result.nestingLayout || []).map((item: any) => ({
            x: Number(item.x) || 0,
            y: Number(item.y) || 0,
            width: Number(item.width) || 0,
            height: Number(item.height) || 0,
        })),
        requestData: {
            ...result.requestData,
            productType: result.requestData.productType,
            material: result.requestData.material,
            color: result.requestData.color,
            lamination: result.requestData.lamination,
            urgency: result.requestData.urgency,
            coverMaterial: result.requestData.coverMaterial,
            innerMaterial: result.requestData.innerMaterial,
            bindingType: result.requestData.bindingType,
            width: Number(result.requestData.width) || 0,
            height: Number(result.requestData.height) || 0,
            depth: Number(result.requestData.depth) || undefined,
            quantity: Number(result.requestData.quantity) || 0,
            pageCount: Number(result.requestData.pageCount) || undefined,
        }
    };
};

export const calculatePrintCost = async (request: CalculationRequest, priceListString: string, products: Product[]): Promise<CalculationResult> => {
    const promptText = `
    Sen poligrafiya xizmatlari uchun FOYDALANUVCHI TOMONIDAN TAQDIM ETILGAN narxlar jadvaliga asoslanib narx hisoblaydigan, xatolarga yo'l qo'ymaydigan, mantiqiy kalkulyatsiya mexanizmisansan.
    Sening yagona va asosiy vazifang - foydalanuvchi so'roviga asoslanib, FAQAT va FAQAT quyida berilgan narxlar jadvalidan foydalangan holda, 100% aniqlik bilan narxni hisoblab, belgilangan JSON formatida qaytarish.
    Taxmin qilish, o'zingdan narx qo'shish yoki noaniq ma'lumotlarga asoslanish QAT'IYAN MAN ETILADI.

    **MUHIM QOIDA:** Agar quyidagi narxlar jadvali bo'sh bo'lsa yoki "Narxlar jadvali kiritilmagan" degan xabarni o'z ichiga olsa, hisoblashdan bosh tort va XATO (error) qaytar. Xato matnida "Hisoblash uchun narxlar kiritilmagan. Iltimos, sozlamalardan narxlar jadvalini to'ldiring." deb yoz.

    **HISOB-KITOB ALGORITMI (DIQQAT BILAN O'QI!):**

    **1. MOS JADVALNI TOPISH:**
    - So'rovdagi 'productType' (mahsulot nomi) va uning qo'shimcha xususiyatlariga (masalan, 'material', 'lamination', 'coverMaterial' va hokazo) qarab, narxlar jadvalidan eng mos keladigan bo'limni top.
    - Jadval sarlavhalari shunday ko'rinishda bo'ladi: \`### Mahsulot Nomi (Xususiyat1: Qiymat1, Xususiyat2: Qiymat2)\`.
    - So'rovdagi barcha xususiyatlarga to'liq mos keladigan jadvalni topishga harakat qil.
    
    **2. HISOB-KITOB TURINI ANIQLASH:**
    Topilgan jadvalga tegishli mahsulot turiga qarab hisoblash usulini tanla:
    - YUZA BO'YICHA: 'Banner', 'Tablichka', 'Glyans chop etish', 'Ofset chop etish', 'Samokleyka', 'DTF chop etish', 'UV DTF chop etish'.
    - SAHIFA SONI BO'YICHA: 'Kitob chop etish'.
    - SONI BO'YICHA: Qolgan barcha mahsulotlar.

    **3. NARXNI HISOB-KITOB QILISH (topilgan jadval asosida):**
    - Agar YUZA bo'yicha bo'lsa: Umumiy yuzani hisobla: \`(width_mm * height_mm / 1,000,000) * quantity\`. Jadvaldagi 'Yuza (m²)' ustunidan hisoblangan umumiy yuzadan KATTA yoki TENG (\`>=\`) bo'lgan BIRINCHI qatorni top va 'Summasi'ni ol.
    - Agar SAHIFA SONI bo'yicha bo'lsa: Jadvaldagi 'Sahifalar soni' ustunidan 'pageCount' qiymatidan KATTA yoki TENG (>=) bo'lgan BIRINCHI qatorni top. 'Narxi'ni ol va Yakuniy narxni hisobla: \`narx_1_sahifa * pageCount * quantity\`.
    - Agar SONI bo'yicha bo'lsa: Jadvaldagi 'Soni' ustunidan 'quantity'dan KATTA yoki TENG (\`>=\`) bo'lgan BIRINCHI qatorni top va 'Summasi'ni ol.

    **4. ISTISNOLAR VA QO'SHIMCHA SHARTLAR:**
    - Katta miqdor: Agar so'ralgan qiymat jadvaldagi ENG KATTA sondan ham ko'p bo'lsa, eng katta qatorning 'Narxi' ustunidagi qiymatni so'ralgan qiymatga ko'paytir.
    - Kichik miqdor: Agar so'ralgan qiymat jadvaldagi ENG KICHIK sondan kam bo'lsa, eng kichik son uchun belgilangan 'Summasi'ni ol.
    - SHOSHILINCHLIK NARXI: 'urgency' maydoni 'express' bo'lsa, yakuniy narxni 25% ga, 'super_express' bo'lsa 50% ga oshir.
    - TUSHUNTIRISH: 'calculationExplanation'da qaysi jadval va qator tanlanganini aniq va batafsil tushuntir.
    
    **YAKUNIY TEKSHIRUV:** JSONni qaytarishdan oldin barcha hisob-kitoblaringni ikki marta tekshir.
    ---
    **FOYDALANUVCHI TOMONIDAN KIRITILGAN NARXLAR JADVALI:**
    ${priceListString}
    ---
    **KIRUVCHI SO'ROV:**
    ${JSON.stringify({ ...request, file: request.file ? { name: request.file.name } : undefined })}
    ---
    **CHIQISH:** Faqat JSON obyektini qaytar. Barcha raqamli maydonlar STRING bo'lishi shart.
    `;
    
    const parts: Part[] = [{ text: promptText }];
    if (request.file) {
      parts.push({
        inlineData: { mimeType: request.file.mimeType, data: request.file.data, },
      });
    }

    try {
        const result = await model.generateContent({
            contents: [{ parts }],
            generationConfig: { ...generationConfig, responseSchema: calculationResultSchema }
        });
        const response = result.response;
        const jsonText = response.text();

        const parsedResult = safeJsonParse(jsonText);
        const finalResult = convertResultStringsToNumbers(parsedResult);
        
        const { file, ...requestData } = request;
        return { ...finalResult, requestData: { ...requestData, productType: request.productType } };
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            throw new Error(`Sun'iy intellekt xizmati bilan bog'lanishda xatolik yuz berdi: ${error.message}`);
        }
        throw new Error("Sun'iy intellekt xizmati bilan bog'lanishda noma'lum xatolik yuz berdi.");
    }
};

const chatResponseSchema = {
    type: "OBJECT",
    properties: {
        responseType: { type: "STRING", enum: ["TEXT", "CALCULATIONS"]},
        textResponse: { type: "STRING" },
        calculationResults: { type: "ARRAY", nullable: true, items: calculationResultSchema },
        suggestedActions: { type: "ARRAY", nullable: true, items: { type: "STRING" } }
    },
    required: ["responseType", "textResponse"]
}

export const processChatMessage = async (history: ChatMessage[], message: string, priceListString: string, products: Product[], file?: FileInfo): Promise<{ textResponse: string, calculationResults: CalculationResult[] | null, suggestedActions: string[] | null }> => {
    const productListForPrompt = products.map(p => `- ${p.name} (ID: ${p.id}, standart o'lchami: ${p.defaultState?.width || 'N/A'}x${p.defaultState?.height || 'N/A'}mm)`).join('\n');

    const prompt = `
    Sen "Print-Master Pro"san, poligrafiya bo'yicha super-intellektual yordamchi. Sening vazifang nafaqat hisoblash, balki mijoz uchun eng yaxshi va tejamkor yechimni topishda yordam berish. Sen xushmuomala, o'z ishining ustasi va har doim yordamga tayyor ekspert.

    MAVJUD MAHSULOTLAR RO'YXATI:
    ${productListForPrompt}

    **SENNING OLTIN QOIDALARING (OG'ISHMAY AMAL QILINISHI SHART!):**

    1.  **NARXLAR JADVALINI TEKSHIRISH:** Ishni boshlashdan oldin, narxlar jadvalini tekshir. Agar bo'sh bo'lsa, foydalanuvchiga sozlamalardan jadvalni to'ldirish kerakligini muloyimlik bilan tushuntir.

    2.  **"HAMMASI YOKI HECH NIMA" QOIDASI (HISOB-KITOB UCHUN):**
        *   Foydalanuvchi so'rovidagi BARCHA MAHSULOTLAR uchun hisob-kitob qilishga ma'lumot to'liq va 100% yetarli bo'lsa (mahsulot turi, soni), FAQAT SHUNDAGINA \`responseType\`ni \`"CALCULATIONS"\` deb belgilaysan.
        *   Agar kamida bitta mahsulot uchun ma'lumot yetishmasa, \`responseType\`ni \`"TEXT"\` deb belgilaysan va \`calculationResults\`ni \`null\` qilasan. QISMAN HISOB-KITOB QILMA! Buning o'rniga, \`textResponse\`da yetishmayotgan ma'lumotlarni bitta xabarda so'raysan.

    3.  **HISOB-KITOB QOIDALARI ("CALCULATIONS" rejimida):**
        *   Har bir mahsulot uchun alohida hisob-kitob ob'ektini yarat.
        *   **MAHSULOTNI ANIQLASH:** Foydalanuvchi xabaridan mahsulot nomini topib, \`requestData.productType\` maydoniga "MAVJUD MAHSULOTLAR RO'YXATI"dagi nom bilan bir xil qilib yoz. Bu eng muhim qism.
        *   **PARAMETRLARNI TO'LDIRISH:** \`requestData\`ning qolgan qismini to'ldir. O'lcham aytilmasa, standartini ishlat.
        *   **MOS JADVALNI TOPISH:** Har bir mahsulot uchun so'rovdagi xususiyatlarga mos keladigan narx jadvalini top.
        *   **NARXNI HISOB-KITOB QILISH:** Mahsulot turiga qarab (SONI, YUZA yoki SAHIFA), jadvaldagi miqdordan KATTA yoki TENG (>=) bo'lgan birinchi qatorni topib, 'Summasi'ni ol yoki 'Narxi'ni ko'paytir.
        *   **TUSHUNTIRISH:** 'calculationExplanation' va 'advice' maydonlarini to'liq va mantiqli to'ldir.
        *   **Barcha raqamli qiymatlarni STRING formatida qaytar.**

    4.  **AQLLI MASLAHATCHI ROLI:**
        *   Har doim optimallashtirish imkoniyatlarini qidir. Agar 800 ta mahsulot so'ralsa, lekin 1000 ta uchun narx arzonroq bo'lsa, shuni taklif qil.

    5.  **TEZKOR AMALLAR QOIDASI (\`suggestedActions\`):**
        *   Foydalanuvchiga yordam berish uchun suhbatni davom ettiruvchi 3-4 ta qisqa harakatlar taklif qil.
    ---
    **FOYDALANUVCHI TOMONIDAN KIRITILGAN NARXLAR JADVALI:**
    ${priceListString}
    ---
    **SUHBAT TARIXI:**
    ${JSON.stringify(history)}
    ---
    **KIRUVCHI XABAR (FOYDALANUVCHINING OXIRGI XABARI):**
    ${JSON.stringify({ message, file: file ? { name: file.name, mimeType: file.mimeType } : 'No file' })}
    ---
    **CHIQISH:** Faqatgina so'ralgan JSON obyektini qaytar. Boshqa hech qanday matn, izoh yoki belgi qo'shma.
    `;
    
    const parts: Part[] = [{ text: prompt }];
    if (file) { parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } }); }

    try {
        const result = await model.generateContent({
            contents: [{ parts }],
            generationConfig: { ...generationConfig, responseSchema: chatResponseSchema }
        });

        const response = result.response;
        const jsonText = response.text();
        const parsedResponse = safeJsonParse(jsonText);

        const finalCalculationResults = (parsedResponse.calculationResults && Array.isArray(parsedResponse.calculationResults))
            ? parsedResponse.calculationResults.map(convertResultStringsToNumbers)
            : null;

        return {
            textResponse: parsedResponse.textResponse || '',
            calculationResults: finalCalculationResults,
            suggestedActions: parsedResponse.suggestedActions || null,
        };
    } catch (error) {
        console.error("Gemini API call failed (chat):", error);
        if (error instanceof Error) {
            throw new Error(`Sun'iy intellekt xizmati bilan bog'lanishda xatolik yuz berdi: ${error.message}`);
        }
        throw new Error("Sun'iy intellekt xizmati bilan bog'lanishda noma'lum xatolik yuz berdi.");
    }
};