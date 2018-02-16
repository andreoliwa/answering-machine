var possibleSentences = `
Hi, {person},
Hello, {person},
Dear {person},

Thanks.
Sorry.

Best regards.
Have a nice weekend and best regards.
Have a nice day and best regards.
`;

var app = new Vue({
    el: '#app',
    data: {
        person: '',
        available: possibleSentences.split('\n').map((e) => e.trim()).filter((e) => e != ''),
        chosen: []
    },
    methods: {
        addSentence: function (index) {
            this.chosen.push(this.available[index]);
        },
        removeSentence: function (index) {
            this.chosen.splice(index, 1);
        },
        clearSentences: function (event) {
            this.chosen.splice(0);
        },
        copyToClipboard: function () {
            var copyTextarea = document.querySelector('.response-to-copy');
            copyTextarea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }
    },
    computed: {
        renderedResponse: function () {
            return this.chosen.join('\n').replace('{person}', this.person);
        }
    }
});

// $(function () {
//     $("#sortable").sortable();
//     $("#sortable").disableSelection();
// });
