import $ from 'jquery'

$(document).ready(() => {
  getTopWord();
  $("#break-down-btn").click(submitText);
})

const getTopWord = () => {
  fetch("https://wordwatch-api.herokuapp.com/api/v1/top_word")
    .then(handleResponse)
    .then(findTopWord)
    .then(errorLog)
};

const submitText = (event) => {
  event.preventDefault();
  let text = $("#textarea-submission").val();
  let split_string = text.split(" ")

  if (split_string.length > 0) {
    postWords(split_string)
    clearTextArea();
  }
};

const clearTextArea = () => {
  $("#textarea-submission").val(" ")
};

const refreshFavoriteWord = () => {
  $("#top-word-container").empty()
}

const postWords = (word_array) => {
  word_array.forEach((word) => {
    postWord(word)
  })
  getTopWord();
};

const postWord = (posted_word) => {
  fetch("https://wordwatch-api.herokuapp.com/api/v1/words", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( {word: {value: posted_word} } )
  })
}

const findTopWord = (word) => {
  let top_word = Object.keys(word.word)
  let top_word_count = Object.values(word.word)

  $('#top-word-container').html(`
    <p> ${top_word} </p>
    <p> ${top_word_count} </p>
    `)
}

const handleResponse = (response) => {
  return response.json()
    .then((json) => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
          json
        };
        return Promise.reject(error)
      }
      return json
    })
};

const errorLog = (error) => {
  console.error({ error })
};
