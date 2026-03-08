'use client';

import CustomButton from '@/components/custom-ui-components/custom-button/custom-button';
import { GO_HOME_LABEL, NOT_FOUND_LABEL, PAGE_NOT_FOUND_LABEL } from '@/utils/texts';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h2 className="mb-8">404</h2>
      <h5 className="mb-8">{PAGE_NOT_FOUND_LABEL}</h5>
      <p className="mb-8 text-center max-w-md">
        {NOT_FOUND_LABEL}
      </p>

        <CustomButton variant="contained" color="primary">
            <Link href="/" >
                {GO_HOME_LABEL}
            </Link>
        </CustomButton>
    </div>

  );
}