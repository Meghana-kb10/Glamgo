import React from 'react';
import { ShieldCheck, PackageCheck, Clock, Award } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: '100% Verified Artists',
      description: 'Rigorous 3-stage background checks & portfolio verification',
      bg: '#F0F8F4',
      border: '#D4EEDF',
      iconBg: '#E1F3EA',
      iconColor: '#1A7F54',
    },
    {
      icon: PackageCheck,
      title: 'Sealed Single-Use Kits',
      description: 'Sterilized tools & disposable applicators opened at venue',
      bg: '#FFF0F5',
      border: '#FAD2E1',
      iconBg: '#FCE7F0',
      iconColor: '#B8336A',
    },
    {
      icon: Clock,
      title: 'Punctuality Guarantee',
      description: 'On-time arrival or receive ₹500 instant wallet credit',
      bg: '#FFF8EE',
      border: '#FDE3C8',
      iconBg: '#FEF0DB',
      iconColor: '#C26E23',
    },
    {
      icon: Award,
      title: 'Haute Beauté Escrow',
      description: 'Funds held securely in Razorpay escrow until service completion',
      bg: '#FAF5EC',
      border: '#F3E4CD',
      iconBg: '#F6EBDA',
      iconColor: '#A0751A',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md border"
              style={{
                backgroundColor: item.bg,
                borderColor: item.border,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                style={{
                  backgroundColor: item.iconBg,
                  color: item.iconColor,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink font-sans">
                  {item.title}
                </h4>
                <p className="text-[11px] text-mauve-grey leading-relaxed mt-0.5 font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
