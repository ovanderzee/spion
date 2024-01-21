import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const name = 'createSpion'

export default [
    {
        input: `src/index.ts`,
        plugins: [
            esbuild()
        ],
        output: [
            {
                file: `dist/${name}.cjs`,
                format: 'umd',
                name: name,
                sourcemap: true,
            },
            {
                file: `dist/${name}.js`,
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
            file: `types/index.d.ts`,
            format: 'es',
        },
    }
]
