function go() {
    var params = new URLSearchParams();
    params.set('username', 'maneesht');
    params.set('password', 'maneesh29');

    fetch(`http://localhost:3000/login`, {
        mode: 'no-cors',
        method: "POST",
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: params
    }).then(function(response) {
        var contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      })
      .then(function(json) { /* process your JSON further */ })
      .catch(function(error) { console.log(error); });
}
//go();
function graphql() {
    
    fetch(`http://localhost:3000/graphql?query=%7B%0A%20%20branches(username%3A%20%22maneesht%22%2C%20repo%3A%20%22HoloGit%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20commits%20%7B%0A%20%20%20%20%20%20sha%0A%20%20%20%20%20%20author%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A`, {
        mode: 'no-cors',
        headers: {
            Cookie: 'connect.sid=s%3Ag9JdjPvmMuRQ-CzfxS05AZx04XRzvf_l.geNRYDwKCoCdIQp6JJ5Qu2Uuo2d27QKoW401v2%2BSBSE; Path=/; HttpOnly'
        },
        method: 'GET'
    });
}
go();