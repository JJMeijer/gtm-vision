import esbuild from 'esbuild';
const { build } = esbuild;

build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    outdir: 'dist',
    minify: false,
    watch: true,
    sourcemap: true,
    platform: 'node',
    target: ['node14'],
});
