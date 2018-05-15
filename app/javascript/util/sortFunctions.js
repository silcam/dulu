import intCompare from './intCompare'

function languageSort(a, b) {
    return a.program_name.localeCompare(b.program_name)
}

function stageSort(a, b) {
    return intCompare(a.progress.percent, b.progress.percent)
}

function lastUpdateSort(a, b) {
    return a.last_update.localeCompare(b.last_update)
}

export { languageSort, stageSort, lastUpdateSort }