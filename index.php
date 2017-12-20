<?php 
function test(){
    $pass = "Pippopaperino123";
    $var1 = 1;
    $var2 = 2;
    $var3 = $var1 + $var2;
    $encodedPass = password_hash($pass, PASSWORD_DEFAULT);
    print_r(encodedPass);
    print_r(" ");
    if(password_verify("Pippopaperino123", $encodedPass) == 1)
        print_r("Password esatta!");
    else
        print_r("Password sbagliata!");
}
?>

<?php
 test();
//phpinfo();

?>


<!DOCTYPE HTML>
<!--
	Projection by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
-->
<html>
	<head>
            <title>CarSEA</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <!-- CSS Start -->
            <link rel="stylesheet" href="styles/css/carsea.css" />
            <link rel="stylesheet" href="styles/css/bootstrap.min.css" />
            <link rel="stylesheet" href="styles/css/bootstrap-grid.min.css" />
            <link rel="stylesheet" href="styles/css/bootstrap-reboot.min.css" />
            <!-- CSS End -->
	</head>
        
        <!-- Scripts -->
        <script src="styles/js/jquery-3.2.1.min.js"></script>
        <script src="styles/js/bootstrap.bundle.min.js"></script>
        <script src="styles/js/skel.min.js"></script>
        <script src="styles/js/util.js"></script>
        <script src="styles/js/main.js"></script>
        
        <script>
        function openModal(){
            $('#myModal').on('shown.bs.modal', function () {
                $('#myInput').focus()
            })
        }
     
        </script>
        <!-- END Scripts -->
        
	<body>

            <!-- Modal to move -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document" style="z-index:9999;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                          ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
              </div>
            <!-- End modal -->
            
		<!-- Header -->
                <header id="header">
                        <div class="inner">
                                <a href="index.html" class="logo"><strong>CarSEA</strong> by Gianmattia Gherardi</a>
                                <nav id="nav">
                                        <a href="#">Cerca un passaggio</a>
                                        <button data-toggle="modal" data-target="#myModal">Iscriviti</button>
                                        <a href="#">Login</a>
                                </nav>
                                <a href="#navPanel" class="navPanelToggle"><span class="fa fa-bars"></span></a>
                        </div>
                </header>

		<!-- Banner -->
                <section id="banner">
                    <div class="inner">
                        <header>
                                <h1>Benvenuti in CarSEA!</h1>
                        </header>
                        <div class="flex">
                            <div>
                                    <span class="icon fa-car"></span>
                                    <h3>Aliquam</h3>
                                    <p>Suspendisse amet ullamco</p>
                            </div>

                            <div>
                                    <span class="icon fa-camera"></span>
                                    <h3>Elementum</h3>
                                    <p>Class aptent taciti ad litora</p>
                            </div>

<!--						<div>
                                    <span class="icon fa-bug"></span>
                                    <h3>Ultrices</h3>
                                    <p>Nulla vitae mauris non felis</p>
                            </div>-->
                        </div>
                        <footer>
                                <a href="#" class="button">Get Started</a>
                        </footer>
                    </div>
                </section>


		<!-- Three -->
                <section id="three" class="wrapper align-center">
                    <div class="inner">
                        <div class="flex flex-2">
                            <article>
                                <div class="image round">
                                        <img src="styles/images/pic01.jpg" alt="Pic 01" />
                                </div>
                                <header>
                                        <h3>Lorem ipsum<br /> dolor amet nullam</h3>
                                </header>
                                <p>Morbi in sem quis dui placerat ornare. Pellentesquenisi<br />euismod in, pharetra a, ultricies in diam sed arcu. Cras<br />consequat  egestas augue vulputate.</p>
                                <footer>
                                        <a href="#" class="button">Learn More</a>
                                </footer>
                            </article>
                            <article>
                                <div class="image round">
                                        <img src="styles/images/pic02.jpg" alt="Pic 02" />
                                </div>
                                <header>
                                        <h3>Sed feugiat<br /> tempus adipicsing</h3>
                                </header>
                                <p>Pellentesque fermentum dolor. Aliquam quam lectus<br />facilisis auctor, ultrices ut, elementum vulputate, nunc<br /> blandit ellenste egestagus commodo.</p>
                                <footer>
                                        <a href="#" class="button">Learn More</a>
                                </footer>
                            </article>
                        </div>
                    </div>
                </section>

		<!-- Footer -->
                <footer id="footer">
                    <div class="inner">

                        <h3>Get in touch</h3>

                        <form action="#" method="post">

                            <div class="field half first">
                                    <label for="name">Name</label>
                                    <input name="name" id="name" type="text" placeholder="Name">
                            </div>
                            <div class="field half">
                                    <label for="email">Email</label>
                                    <input name="email" id="email" type="email" placeholder="Email">
                            </div>
                            <div class="field">
                                    <label for="message">Message</label>
                                    <textarea name="message" id="message" rows="6" placeholder="Message"></textarea>
                            </div>
                            <ul class="actions">
                                    <li><input value="Send Message" class="button alt" type="submit"></li>
                            </ul>
                        </form>

                        <div class="copyright">
                                &copy; Gianmattia Gherardi
                        </div>

                    </div>
                </footer>
	</body>
</html>