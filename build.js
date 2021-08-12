import esbuild from 'esbuild';
const { build } = esbuild;

build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    outfile: 'dist/server.js',
    minify: true,
    sourcemap: true,
    watch: true,
    platform: 'node',
    target: ['node14'],
});
