function renderFullPage(html, initialState, isMobile) {
  return `
  <html>
	  <head>
		  <meta charSet="utf-8" />
		  <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		  <title>eurotwenty16</title>
          <meta property="og:title" content="eurotwenty16">
            <meta property="og:site_name" content="eurotwenty16">
            <meta property="og:url" content="http://eurotwenty16.com">
            <meta property="og:description" content="See the latest scores and fixtures at http://eurotwenty16.com">
            <meta property="fb:app_id" content="">
            <meta property="og:type" content="website">
            <meta property="og:image" content="http://eurotwenty16.com/s/img/icon/share.jpg">
		  <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>
		  <link href='/s/css/screen.css' rel='stylesheet' type='text/css'>
          <link rel="apple-touch-icon" sizes="57x57" href="/s/img/icon/apple-icon-57x57.png">
            <link rel="apple-touch-icon" sizes="60x60" href="/s/img/icon/apple-icon-60x60.png">
            <link rel="apple-touch-icon" sizes="72x72" href="/s/img/icon/apple-icon-72x72.png">
            <link rel="apple-touch-icon" sizes="76x76" href="/s/img/icon/apple-icon-76x76.png">
            <link rel="apple-touch-icon" sizes="114x114" href="/s/img/icon/apple-icon-114x114.png">
            <link rel="apple-touch-icon" sizes="120x120" href="/s/img/icon/apple-icon-120x120.png">
            <link rel="apple-touch-icon" sizes="144x144" href="/s/img/icon/apple-icon-144x144.png">
            <link rel="apple-touch-icon" sizes="152x152" href="/s/img/icon/apple-icon-152x152.png">
            <link rel="apple-touch-icon" sizes="180x180" href="/s/img/icon/apple-icon-180x180.png">
            <link rel="icon" type="image/png" sizes="192x192"  href="/s/img/icon/android-icon-192x192.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/s/img/icon/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="96x96" href="/s/img/icon/favicon-96x96.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/s/img/icon/favicon-16x16.png">
            <meta name="msapplication-TileColor" content="#ffffff">
            <link rel="manifest" href="/s/manifest.json">
            <meta name="msapplication-TileImage" content="/s/img/icon/ms-icon-144x144.png">
            <meta name="theme-color" content="#ffffff">
		  <script>
			  window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
		  </script>
		  <script async src='/s/bundle.js'></script>
	  </head>
	  <body>
		  <div id="root">
			  ${html}
		  </div>
          <Footer class="Footer js-slideDown">
            <div class="container">
                <div class="row">
                    <div class="col-sm-7">
                            <a href="https://crowdscores.com/" class="Footer-logo"><span>Data provided by</span> <img src="/s/img/crowdscores.svg" alt="Crowdscores logo"></a>
                    </div>
                    <div class="col-sm-7">
                        <div class="Footer-credits">
                            <p>Design and build by<br/><a href="https://twitter.com/AshDowie" class="Footer-link">@AshDowie</a> and <a href="https://twitter.com/adamledwards" class="Footer-link">@AdamLEdwards</a></p>
                        </div>
                    </div>
                </div>
          </div>
          <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-79133882-1', 'auto');
  ga('send', 'pageview');

</script>
	  </body>
</html>
    `
}

export default renderFullPage
