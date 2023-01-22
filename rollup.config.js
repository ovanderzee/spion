import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const name = 'spion'

export default [
    {
        input: `src/index.ts`,
        plugins: [
            esbuild()
        ],
        output: [
            {
                file: `dist/${name}.js`,
                format: 'cjs',
                name: name,
                sourcemap: true,
            },
            {
                file: `module/${name}.js`,
                format: 'esm',
                name: name,
                sourcemap: true,
            },
        ]
    },
    {
        input: `src/index.ts`,
        plugins: [
            dts()
        ],
        output: {
            file: `types/${name}.d.ts`,
            format: 'es',
        },
    }
]
