function(instance, properties) {

    const bgImage = "https://s3.amazonaws.com/appforest_uf/f1676126930334x924732810923051900/113980577.png";

    instance.canvas.css({
        "width": `${properties.bubble.width()}px`,
        "height": `${properties.bubble.height()}px`,
        "background-image": `url(${bgImage})`,
        "background-repeat": 'no-repeat, repeat',
        "background-position": 'center',
        "background-size": 'contain'
    })
}