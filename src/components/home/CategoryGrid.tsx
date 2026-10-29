import React from 'react';
import {
  Sparkles,
  Scissors,
  Gem,
  Droplets,
  Feather,
  Crown,
  Flower2,
  UserCheck,
} from 'lucide-react';
import { MarketplaceCategory } from '../../services/marketplaceService';

interface CategoryGridProps {
  categories: MarketplaceCategory[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
}

const CATEGORY_THEMES: Record<
  string,
  {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    sublabel: string;
    icon: React.ElementType;
  }
> = {
  makeup: {
    bg: '#FFF0F5',
    border: '#FAD2E1',
    iconBg: '#FCE7F0',
    iconColor: '#B8336A',
    sublabel: 'From ₹999',
    icon: Sparkles,
  },
  hair: {
    bg: '#FFF8EE',
    border: '#FDE3C8',
    iconBg: '#FEF0DB',
    iconColor: '#C26E23',
    sublabel: 'From ₹499',
    icon: Scissors,
  },
  nails: {
    bg: '#F8F3FC',
    border: '#E9DCF7',
    iconBg: '#F1E5FB',
    iconColor: '#8244B2',
    sublabel: 'From ₹599',
    icon: Gem,
  },
  skin: {
    bg: '#F0F8F4',
    border: '#D4EEDF',
    iconBg: '#E1F3EA',
    iconColor: '#1A7F54',
    sublabel: 'From ₹799',
    icon: Droplets,
  },
  waxing: {
    bg: '#FFF4ED',
    border: '#FDDCC9',
    iconBg: '#FEE7D8',
    iconColor: '#C85B28',
    sublabel: 'Rica roll-on',
    icon: Feather,
  },
  bridal: {
    bg: '#FAF5EC',
    border: '#F3E4CD',
    iconBg: '#F6EBDA',
    iconColor: '#A0751A',
    sublabel: 'Royal Couture',
    icon: Crown,
  },
  spa: {
    bg: '#F1F7F9',
    border: '#D5EBF0',
    iconBg: '#E2F1F4',
    iconColor: '#227084',
    sublabel: 'Aroma Care',
    icon: Flower2,
  },
  mens: {
    bg: '#F4F5F7',
    border: '#DFE2E7',
    iconBg: '#E8EAEE',
    iconColor: '#3F4756',
    sublabel: 'Grooming',
    icon: UserCheck,
  },
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-plum block">
            Atelier Directory
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink font-sans tracking-tight">
            Explore Services by Category
          </h2>
        </div>
        <span className="text-xs text-mauve-grey hidden sm:inline">
          Doorstep &amp; Studio Appointments
        </span>
      </div>

      {/* Ceramic Pastel Category Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
          const theme = CATEGORY_THEMES[cat.slug.toLowerCase()] || {
            bg: '#FFF0F5',
            border: '#FAD2E1',
            iconBg: '#FCE7F0',
            iconColor: '#B8336A',
            sublabel: 'Explore',
            icon: Sparkles,
          };
          const IconComponent = theme.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-md border ${
                isSelected
                  ? 'ring-2 ring-rose-plum ring-offset-2 shadow-sm'
                  : 'hover:border-opacity-100'
              }`}
              style={{
                backgroundColor: theme.bg,
                borderColor: isSelected ? '#B8336A' : theme.border,
              }}
            >
              {/* Icon Container */}
              <div
                className="w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-2xs mb-2"
                style={{
                  backgroundColor: theme.iconBg,
                  color: theme.iconColor,
                }}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Title & Subtitle */}
              <div className="w-full">
                <span className="text-xs sm:text-[13px] font-bold text-ink block truncate group-hover:text-rose-plum transition-colors font-sans">
                  {cat.name}
                </span>
                <span className="text-[10px] font-medium text-mauve-grey block truncate mt-0.5">
                  {theme.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
