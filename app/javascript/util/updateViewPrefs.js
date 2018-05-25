import axios from 'axios'

function updateViewPrefs(prefs) {
    axios.put('/api/people/update_view_prefs', {
        view_prefs: prefs
    })
}

export default updateViewPrefs