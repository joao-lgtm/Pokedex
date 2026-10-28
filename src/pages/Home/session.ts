export const PAGE = 36;

// Estado da lista sobrevive à ida e volta da tela de detalhe
export const session = {
    query: "",
    type: "",
    visible: PAGE,
    scrollTop: 0,
    lastOpened: 0,
    animated: false,
};

/** Card para onde a arte "voa" de volta ao sair do detalhe. */
export function rememberOpened(id: number) {
    session.lastOpened = id;
}
