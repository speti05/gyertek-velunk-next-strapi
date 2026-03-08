'use client';

import CustomButton from '@/components/custom-ui-components/custom-button/custom-button';
import { ERROR_LABEL, GO_HOME_LABEL, SERVER_SIDE_ERROR_LABEL } from '@/utils/texts';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <h2 className="mb-8">500</h2>
                <h5 className="mb-8">{SERVER_SIDE_ERROR_LABEL}</h5>
                <p className="mb-8 text-center max-w-md">{ERROR_LABEL}</p>
                <CustomButton
                    variant="contained"
                    color="secondary"
                    className="mt-6"
                >
                    <Link href="/">{GO_HOME_LABEL}</Link>
                </CustomButton>
            </div>
        </div>
    );
}