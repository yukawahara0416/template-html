const options = {
  rules: {
    name: {
      required: true,
      rangelength: [3, 6],
    },
    fname: {
      required: true,
      min: 3,
    },
    lname: {
      required: true,
      min: 3,
    },
    kana: {
      required: true,
      hiragana: true,
      rangelength: [3, 20],
    },
    age: {
      required: true,
      digits: true,
      min: 18,
    },
    email: {
      required: true,
      email: true,
    },
    tel: {
      required: true,
      telnum: true,
    },
    mobile: {
      required: true,
      mobilenum: true,
    },
    zip: {
      required: true,
      postnum: true,
    },
  },
  messages: {
    // name: {
    //   required: '名前は必須項目です。',
    //   rangelength: '名前は3文字以上、6文字以下で入力してください。',
    // },
  },
  // フォーム内容がValidだった場合のコールバック関数を指定
  submitHandler(form) {
    form.submit();
  },
  // フォーム内容がInvalidだった場合のコールバック関数を指定
  invalidHandler(form, validator) {
    $('#error').text('入力エラーが' + validator.numberOfInvalids() + '個あります');
  },
  ignore: '.ignore', //class="ignore"はvalidateしない
  debug: false, // デバッグモード フォームは送信されない
  errorClass: 'error',
  validClass: 'valid',
  errorElement: 'p',
  errorPlacement(err, element) {
    element.after(err);
  },
};

$('#myform').validate(options);

// jQuery Validate Pluginの解説とValidate 日本語環境用PluginとjQuery Form Pluginとの連携 - くらげだらけ https://kudakurage.hatenadiary.com/entry/20091211/1260521031
// validate.jsの使い方をまとめてみた | ダボハゼのブログ https://dabohaze.site/validate-js-how-to/
// jQuery Validation Pluginが使いやすくておすすめ - Qiita https://qiita.com/uedatakeshi/items/8b46bf7da1b81aad5650
