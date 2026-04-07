const template = `<i>{{ text }}</i>`;

function convertToOrdinal(num = 1) {
  var suffixes = ['st', 'nd', 'rd'];
  var lastDigit = num % 10;
  var suffix = suffixes[lastDigit - 1] || 'th';
  return '' + num + suffix;
}

export default {
  template,
  props: ['times', 'location'],
  computed: {
    text: function () {
      return 'The ' + convertToOrdinal(this.times) + ' time in ' + this.location;
    },
  },
};
