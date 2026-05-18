//@ts-check
// Package imports
import * as esbuild from 'esbuild'

export const buildDev = async function() {
    return esbuild.build({
        entryPoints: ['./src/index.tsx'],
        minify: true,
        sourcemap: true,
        //target: ['es2017', 'chrome58', 'firefox57', 'safari11'],
        bundle: true,
        write: false
    }).then(function(output) {
        const script_buffer = output.outputFiles[0].text
        return script_buffer
    }).catch(function(error) {
        const errorMsg = error instanceof Error ? error.message : "Something went wrong!"
        return Error(errorMsg)
    })
}

export const buildProduction = async function() {
    return esbuild.build({
        entryPoints: ['./src/index.tsx'],
        minify: true,
        sourcemap: true,
        target: ['es2017'],
        bundle: true,
        outfile: './public/default.js'
    }).then(function() {
        console.log("The website files have been compiled!")
    }).catch(function(error) {
        const errorMsg = error instanceof Error ? error.message : "Something went wrong!"
        return Error(errorMsg)
    })
}

export default buildProduction