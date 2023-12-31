'use client';

import {Button, createTheme, CSSVariablesResolver} from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'lime',
    primaryShade: {
        light: 8,
        dark: 7
    },
    components: {
        Button: Button.extend({
            defaultProps: {
                variant: 'outline'
            }
        })
    }
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