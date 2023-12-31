import './globals.css'
import type {Metadata} from 'next'

import '@mantine/core/styles.css';
import React from 'react';
import {MantineProvider, ColorSchemeScript} from '@mantine/core';
import {theme, resolver} from '@/theme';


export const metadata: Metadata = {
    title: 'Dictionary Filter',
    description: 'Handy Tool to Filter and Find Dictionary Words',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <ColorSchemeScript/>
            <link rel="shortcut icon" href="/favicon.ico"/>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <MantineProvider theme={theme} defaultColorScheme={"auto"}
                         cssVariablesResolver={resolver}>{children}</MantineProvider>
        </body>
        </html>
    )
}
