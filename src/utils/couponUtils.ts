// Dummy coupon codes for frontend validation
// In real backend, this would be an API call

export interface Coupon {
  code: string;
  discount: number; // percentage
  minAmount: number;
  description: string;
  isValid: boolean;
}

const DUMMY_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    minAmount: 200,
    description: '10% off on orders above ₹200',
    isValid: true
  },
  {
    code: 'SAVE20',
    discount: 20,
    minAmount: 500,
    description: '20% off on orders above ₹500',
    isValid: true
  },
  {
    code: 'FIRST50',
    discount: 50,
    minAmount: 300,
    description: '50% off for first-time customers (min ₹300)',
    isValid: true
  },
  {
    code: 'EXPIRED',
    discount: 15,
    minAmount: 100,
    description: 'This coupon has expired',
    isValid: false
  }
];

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number;
}

export const validateCoupon = async (code: string, orderAmount: number): Promise<CouponValidationResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const coupon = DUMMY_COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());
  
  if (!coupon) {
    return {
      isValid: false,
      error: 'Invalid coupon code'
    };
  }
  
  if (!coupon.isValid) {
    return {
      isValid: false,
      error: 'This coupon has expired or is no longer valid'
    };
  }
  
  if (orderAmount < coupon.minAmount) {
    return {
      isValid: false,
      error: `Minimum order amount of ₹${coupon.minAmount} required for this coupon`
    };
  }
  
  const discountAmount = Math.floor((orderAmount * coupon.discount) / 100);
  
  return {
    isValid: true,
    coupon,
    discountAmount
  };
};

export const getAvailableCoupons = (): Coupon[] => {
  return DUMMY_COUPONS.filter(c => c.isValid);
};