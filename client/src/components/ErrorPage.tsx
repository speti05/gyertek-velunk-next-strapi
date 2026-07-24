import Image from "next/image";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { GO_HOME_LABEL, TRY_AGAIN_LABEL } from "@/utils/texts";

interface ErrorPageProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorPage({ title, description, onRetry }: Readonly<ErrorPageProps>) {
  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__content">
          <h2 className="error-page__title">{title}</h2>
          <p className="error-page__description">{description}</p>
          <div className="error-page__actions">
            {onRetry && (
              <CustomButton variant="contained" color="primary" onClick={onRetry}>
                {TRY_AGAIN_LABEL}
              </CustomButton>
            )}
            <CustomButton variant="contained" color={onRetry ? "secondary" : "primary"}>
              <CustomLink href="/" color="inherit" underline="none">
                {GO_HOME_LABEL}
              </CustomLink>
            </CustomButton>
          </div>
        </div>
        <div className="error-page__image">
          <Image
            src="/error_image.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 36rem, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
