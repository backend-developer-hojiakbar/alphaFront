// src/constants.ts

import {
    CreditCard,
    Newspaper,
    BookOpen,
    Box,
    Ticket,
    Tag,
    FileQuestion,
    DoorOpen,
    Blocks,
    FileText,
    PenSquare,
    BookMarked,
    CalendarDays,
    Gift,
    ShoppingBag,
    Stamp,
    Folder,
    Sun,
    Printer,
    Sticker,
    Shirt,
    Layers,
    BookCopy,
    Presentation,
    Square,
    Clipboard,
  } from 'lucide-react';
  
  export const COLORS = [
      { id: '4+0', name: 'Bir tomonlama rangli (4+0)' },
      { id: '4+4', name: 'Ikki tomonlama rangli (4+4)' },
      { id: '1+0', name: 'Oq-qora (1+0)' },
      { id: '1+1', name: 'Ikki tomonlama oq-qora (1+1)' },
      { id: 'other', name: 'Boshqa (o\'zingiz kiriting)'}
  ];
  
  export const LAMINATIONS = [
      { id: 'none', name: 'Laminatsiyasiz' },
      { id: 'glossy', name: 'Yaltiroq (Glossy)' },
      { id: 'matte', name: 'Matoviy (Matte)' },
      { id: 'other', name: 'Boshqa (o\'zingiz kiriting)'}
  ];
  
  export const BINDING_TYPES = [
      { id: 'saddle-stitch', name: 'Skrepka (Saddle stitch)'},
      { id: 'perfect-binding', name: 'Termokley (Perfect binding)' },
      { id: 'wire-o', name: 'Prujina (Wire-O)' },
      { id: 'hardcover', name: 'Qattiq muqova (Hardcover)'},
      { id: 'other', name: 'Boshqa (o\'zingiz kiriting)'}
  ];
  
  export const URGENCY_OPTIONS = [
      { id: 'standard', name: "Standart (3-5 ish kuni)" },
      { id: 'express', name: "Tezkor (1-2 ish kuni) [+25%]" },
      { id: 'super_express', name: "Super Tezkor (24 soat) [+50%]" },
  ];
  
  export const DESIGN_SERVICES = [
      { id: 'none', name: 'Dizayn kerak emas', cost: 0 },
      { id: 'vizitka', name: 'Vizitka dizayni', cost: 100000 },
      { id: 'flayer', name: 'Flayer dizayni', cost: 150000 },
      { id: 'buklet', name: 'Buklet dizayni', cost: 250000 },
      { id: 'katalog', name: 'Katalog dizayni (1 bet)', cost: 80000 },
      { id: 'logo', name: 'Logotip dizayni', cost: 500000 },
      { id: 'banner', name: 'Banner dizayni', cost: 200000 },
  ];
  
  export const LUCIDE_ICONS: { [key: string]: React.ElementType } = {
    CreditCard,
    Newspaper,
    BookOpen,
    Box,
    Ticket,
    Tag,
    FileQuestion,
    DoorOpen,
    Blocks,
    FileText,
    PenSquare,
    BookMarked,
    CalendarDays,
    Gift,
    ShoppingBag,
    Stamp,
    Folder,
    Sun,
    Printer,
    Sticker,
    Shirt,
    Layers,
    BookCopy,
    Presentation,
    Square,
    Clipboard,
  };