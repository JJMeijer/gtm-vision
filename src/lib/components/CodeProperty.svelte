<script lang="ts">
    import { onMount, getContext } from "svelte";
    import { page } from "$app/stores";

    import { EditorView, drawSelection, keymap, lineNumbers } from "@codemirror/view";
    import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
    import { defaultKeymap } from "@codemirror/commands";
    import { Compartment, EditorState } from "@codemirror/state";
    import { html } from "@codemirror/lang-html";
    import { javascript } from "@codemirror/lang-javascript";

    import type { ResolvedContainer } from "$lib/gtm/types";
    import { getComponentLink } from "$lib/utility";
    import { LoadingSpinner } from "$components";

    export let code: string;
    export let language: "html" | "javascript";

    let view: EditorView;
    let element: HTMLDivElement;

    let mounted = false;
    let unminifying = false;

    const resolvedContainer = getContext<ResolvedContainer>($page.params.id);

    let updateCode = (code: string) => {
        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: code,
            },
        });
    };

    let updateLanguage = (language: "html" | "javascript") => {
        if (language === "html") {
            view.dispatch({
                effects: languageSetting.reconfigure(html()),
            });
        } else {
            view.dispatch({
                effects: languageSetting.reconfigure(javascript()),
            });
        }
    };

    let languageSetting = new Compartment();

    let editorState = EditorState.create({
        doc: code,
        extensions: [
            lineNumbers(),
            drawSelection(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            languageSetting.of(language === "html" ? html() : javascript()),
            EditorState.allowMultipleSelections.of(true),
            keymap.of(defaultKeymap),
            EditorView.editable.of(false),
            EditorView.contentAttributes.of({
                tabindex: "0",
            }),
            EditorView.lineWrapping,
            EditorView.theme({
                ".cm-gutter": {
                    paddingLeft: "0.5rem",
                    color: "rgb(113 113 122 / 0.7)",
                },
                "&.cm-focused.cm-editor": {
                    outline: "none",
                },
            }),
        ],
    });

    onMount(() => {
        mounted = true;
        return () => {
            mounted = false;
        };
    });

    $: if (mounted && !view) {
        view = new EditorView({
            state: editorState,
            parent: element,
        });
    }

    $: if (mounted && view) {
        updateCode(code);
        updateLanguage(language);
    }

    // extract variable references from the code
    $: variableReferences = Array.from(code.matchAll(/\{\{(.+?)\}\}/g)).map((match) => match[1]);

    const onUnMinify = async () => {
        if (unminifying) return;
        unminifying = true;

        const res = await fetch("/unminify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
            }),
        });

        unminifying = false;

        if (!res.ok) {
            console.error("Failed to unminify the code");
            return;
        }

        const data = await res.json();

        code = data.unminified;
    };
</script>

<div class="flex flex-col pb-4 gap-1 w-full">
    <div class="flex flex-row items-center justify-between w-full">
        <p class="text-zinc-500/70">{language.toUpperCase()}</p>
        <button
            on:click={onUnMinify}
            title="Unminify the code (Powered by ChatGPT)"
            class="bg-neutral-100 flex rounded-xl py-1 px-4 text-neutral-400/50 hover:text-neutral-600 hover:bg-neutral-300"
        >
            Unminify
        </button>
    </div>
    <div
        class="relative border border-zinc-300 max-h-[20rem] overflow-y-auto scrollbar-thin hover:scrollbar-track-neutral-100 scrollbar-track-neutral-100/50 scrollbar-thumb-neutral-200 {unminifying &&
            'pointer-events-none'}"
        bind:this={element}
    >
        {#if unminifying}<LoadingSpinner />{/if}
    </div>
    {#if variableReferences.length > 0}
        <div class="flex flex-row items-center flex-wrap gap-2 pt-1">
            <span class="text-sm text-zinc-500">Variables:</span>
            {#each variableReferences as variableReference}
                <a
                    href={getComponentLink(variableReference, resolvedContainer)}
                    class="text-sm text-zinc-600 p-1 bg-zinc-200/50 hover:bg-zinc-200 rounded-md"
                >
                    {variableReference}
                </a>
            {/each}
        </div>
    {/if}
</div>
