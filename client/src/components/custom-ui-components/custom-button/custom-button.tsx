'use client';

import React from 'react';
import { type ButtonProps, Button } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
    children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
    return (
        <Button
            className='custom-button'
            {...props}>
                {children}
        </Button>
    );
};

export default CustomButton;