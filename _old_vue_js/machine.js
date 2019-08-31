var defaultSentences = `
Hi, {person},
Hello, {person},
Dear {person},

Thanks.
Sorry.

Best regards.
Have a nice weekend and best regards.
Have a nice day and best regards.
`;

var parseSentences = text =>
  text
    .split("\n")
    .map(e => e.trim())
    .filter(e => e != "");

var app = new Vue({
  el: "#app",
  data: {
    person: "",
    available: parseSentences(defaultSentences),
    chosen: []
  },
  methods: {
    addSentence: function(index) {
      this.chosen.push(this.available[index]);
    },
    removeSentence: function(index) {
      this.chosen.splice(index, 1);
    },
    clearSentences: function(event) {
      this.chosen.splice(0);
    },
    copyToClipboard: function() {
      var copyTextarea = document.querySelector(".response-to-copy");
      copyTextarea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
      } catch (err) {
        console.log("Oops, unable to copy");
      }
    },
    uploadTextFile: function(e) {
      var files = e.target.files;
      if (!files[0]) {
        return;
      }
      var reader = new FileReader();
      reader.onload = e => {
        this.available = parseSentences(e.target.result);
        this.clearSentences();
      };
      reader.readAsText(files[0]);
    }
  },
  computed: {
    renderedResponse: function() {
      return this.chosen.join("\n").replace(/\{person\}/g, this.person);
    }
  }
});

// $(function () {
//     $("#sortable").sortable();
//     $("#sortable").disableSelection();
// });
