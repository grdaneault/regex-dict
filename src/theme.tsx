'use client';

import {createTheme, CSSVariablesResolver} from '@mantine/core';

export const theme = createTheme({
    /* Put your mantine theme override here */
});

export const resolver: CSSVariablesResolver = (theme) => ({
    variables: {},
    light: {
        '--mantine-background-start-rgb': theme.colors.gray[0],
        '--mantine-background-end-rgb': theme.colors.gray[2]
    },
    dark: {
        '--mantine-background-start-rgb': theme.colors.dark[7],
        '--mantine-background-end-rgb': theme.colors.dark[9]
    }
})