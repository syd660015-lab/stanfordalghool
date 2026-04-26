export const SUBTESTS = [
  { 
    id: 'nv_fr', 
    name: 'Nonverbal Fluid Reasoning', 
    arabicName: 'الاستدلال التحليلي غير اللفظي',
    items: Array.from({ length: 36 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'v_k', 
    name: 'Verbal Knowledge', 
    arabicName: 'المعلومات اللفظية',
    items: Array.from({ length: 44 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'nv_vs', 
    name: 'Nonverbal Visual-Spatial', 
    arabicName: 'المعالجة البصرية المكانية غير اللفظية',
    items: Array.from({ length: 30 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'v_vs', 
    name: 'Verbal Visual-Spatial', 
    arabicName: 'المعالجة البصرية المكانية اللفظية',
    items: Array.from({ length: 30 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'nv_wm', 
    name: 'Nonverbal Working Memory', 
    arabicName: 'الذاكرة العاملة غير اللفظية',
    items: Array.from({ length: 32 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'v_wm', 
    name: 'Verbal Working Memory', 
    arabicName: 'الذاكرة العاملة اللفظية',
    items: Array.from({ length: 32 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'nv_k', 
    name: 'Nonverbal Knowledge', 
    arabicName: 'المعلومات غير اللفظية',
    items: Array.from({ length: 36 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'nv_qr', 
    name: 'Nonverbal Quantitative Reasoning', 
    arabicName: 'الاستدلال الكمي غير اللفظي',
    items: Array.from({ length: 36 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'v_fr', 
    name: 'Verbal Fluid Reasoning', 
    arabicName: 'الاستدلال التحليلي اللفظي',
    items: Array.from({ length: 36 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  },
  { 
    id: 'v_qr', 
    name: 'Verbal Quantitative Reasoning', 
    arabicName: 'الاستدلال الكمي اللفظي',
    items: Array.from({ length: 36 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }))
  }
];

export const SCORING_TABLES = {
  // Mock scoring table for IQ conversion
  // In a real app, this would be a large lookup table
  subtestToStandard: (raw: number) => Math.min(20, Math.max(0, Math.round(raw / 2))),
  sumToIQ: (sum: number) => 40 + sum,
};
