import logoMark from '../assets/logo-mark.svg';

type BrandLogoProps = {
  compact?: boolean;
  center?: boolean;
  title?: string;
  subtitle?: string;
  iconOnly?: boolean;
};

export function BrandLogo({
  compact = false,
  center = false,
  title = '爱自由域名管理',
  subtitle = 'Domain Management Console',
  iconOnly = false,
}: BrandLogoProps) {
  const className = ['brand-mark', compact ? 'compact' : '', center ? 'brand-mark--center' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <div className="brand-mark__icon" aria-hidden="true">
        <img src={logoMark} alt="" className="brand-mark__icon-image" />
      </div>
      {!iconOnly ? (
        <div className="brand-mark__copy">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
      ) : null}
    </div>
  );
}
