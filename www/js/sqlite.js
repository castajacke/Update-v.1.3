"use strict";

var Note = React.createClass({
    displayName: "Note",
    render: function render() {
        var style = { backgroundColor: this.props.color };
        return React.createElement(
            "div",
            { className: "note", style: style },
            React.createElement(
                "span",
                { className: "delete-note", onClick: this.props.onDelete },
                "×"
            ),
            this.props.children
        );
    }
});
var NoteSearch = React.createClass({
    displayName: "NoteSearch",
    render: function render() {
        return React.createElement("input", { className: "noteSearch", type: "search", placeholder: "Search...", onChange: this.props.onSearch });
    }
});
var NoteColors = React.createClass({
    displayName: "NoteColors",
    render: function render() {
        var _this = this;

        var colors = ["yellow", "red"];
        return React.createElement(
            "div",
            { className: "colors-list" },
            colors.map(function (el, i) {
                return React.createElement(
                    "div",
                    { key: i, style: { backgroundColor: el } },
                    React.createElement("input", {
                        className: "radio-custom",
                        id: el,
                        type: "radio",
                        name: "color",
                        onChange: function onChange(e) {
                            return _this.props.onColorChanged(e, el);
                        }
                    }),
                    React.createElement("label", { className: "radio-custom-label", htmlFor: el })
                );
            })
        );
    }
});
var NoteEditor = React.createClass({
    displayName: "NoteEditor",
    getInitialState: function getInitialState() {

        this._hadleColorChange = this.hadleColorChange.bind(this);

        return {
            text: '',
            color: '',
            checked: false
        };
    },
    hadleTextChange: function hadleTextChange(e) {
        this.setState({
            text: e.target.value
        });
    },
    hadleColorChange: function hadleColorChange(e, color) {
        this.input = e.target;
        this.setState({
            color: color,
            checked: e.target.checked
        });
    },
    handleNoteAdd: function handleNoteAdd() {
        if (this.state.text.length) {
            var newNote = {
                about: this.state.text,
                color: this.state.color,
                id: new Date()
            };
            this.props.onNoteAdd(newNote);
            this.setState({
                text: '',
                color: '',
                checked: false
            });
            if (this.state.checked) this.input.checked = false;
        }
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "note-editor" },
            React.createElement("textarea", {
                className: "textarea",
                placeholder: "Enter your note here...",
                rows: 5,
                value: this.state.text,
                onChange: this.hadleTextChange }),
            React.createElement(
                "div",
                { className: "controls" },
                React.createElement(NoteColors, { onColorChanged: this._hadleColorChange }),
                React.createElement(
                    "button",
                    { className: "add-button", onClick: this.handleNoteAdd },
                    "Add"
                )
            )
        );
    }
});
var NoteGrid = React.createClass({
    displayName: "NoteGrid",
    getInitialState: function getInitialState() {
        return {
            value: ''
        };
    },
    componentDidMount: function componentDidMount() {
        this.msnry = new Masonry(this.grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10
        });
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (this.props.notes.length != prevProps.notes.length || this.state.value.length != prevState.value.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },
    handleSearch: function handleSearch(e) {
        this.setState({
            value: e.target.value
        });
    },
    render: function render() {
        var _this2 = this;

        var searchQuery = this.state.value.toLowerCase();
        var displayedNotes = !this.state.value ? this.props.notes : this.props.notes.filter(function (item) {
            var searchValue = item.about.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });
        console.log(displayedNotes);
        return React.createElement(
            "div",
            null,
            React.createElement(NoteSearch, { onSearch: this.handleSearch }),
            React.createElement(
                "div",
                { ref: function ref(div) {
                        return _this2.grid = div;
                    }, className: "notes-grid" },
                displayedNotes.map(function (note) {
                    return React.createElement(
                        Note,
                        {
                            key: note.id,
                            color: note.color,
                            onDelete: _this2.props.onNoteDelete.bind(null, note)
                        },
                        note.about
                    );
                })
            )
        );
    }
});
var NoteApp = React.createClass({
    displayName: "Note App",
    getInitialState: function getInitialState() {
        return {
            // notes: this.props.notes
            notes: []
        };
    },
    componentDidMount: function componentDidMount() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({
                notes: localNotes
            });
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        this.updateLocalStorage();
    },
    handleDeleteNote: function handleDeleteNote(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function (note) {
            return note.id != noteId;
        });
        this.setState({
            notes: newNotes
        });
    },
    handleNoteAdd: function handleNoteAdd(newNote) {
        this.setState({
            notes: [newNote].concat(this.state.notes)
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "notes-app" },
            React.createElement(
                "h2",
                { className: "app-header" },
                "Notes App"
            ),
            React.createElement(NoteEditor, { onNoteAdd: this.handleNoteAdd }),
            React.createElement(NoteGrid, { notes: this.state.notes, onNoteDelete: this.handleDeleteNote })
        );
    },
    updateLocalStorage: function updateLocalStorage() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});
ReactDOM.render(React.createElement(NoteApp, null), document.getElementById('content'));