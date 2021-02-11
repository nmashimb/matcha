DROP TABLE `userinfor`;

CREATE TABLE `userinfor` (
  `id` mediumint(8) unsigned NOT NULL auto_increment,
  `username` varchar(255) default NULL,
  `firstname` varchar(255) default NULL,
  `lastname` varchar(255) default NULL,
  `latitude` varchar(30) default NULL,
  `longitude` varchar(30) default NULL,
  `date_of_birth` varchar(255),
  `score` mediumint default NULL,
  `email` varchar(255) default NULL,
  `password` varchar(255),
  `verified` varchar(255) default NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Tobias","Paki","Justina","-81.04959","-32.39403","2000/03/03",4,"lacus.Ut@dolor.com","RMD97PVF4BI","1"),("Desiree","Reed","Evan","62.46804","-38.19716","1987/08/08",8,"lorem@orciadipiscingnon.edu","AVR71GNH6BV","1"),("Phelan","Ahmed","Hedy","3.50331","69.99223","1997/01/10",1,"sapien.gravida@vitae.net","LID39WOY0BO","1"),("Ursula","Amethyst","Nolan","-29.83797","32.26197","1994/02/13",5,"Cum.sociis@estNunc.org","CHO44ZXC5HJ","1"),("Maggy","Simon","Bryar","-51.49556","-62.42887","2000/02/03",1,"tincidunt@Integer.org","LQN36RPP3NI","1"),("Kuame","Lacota","Devin","8.706","149.69863","1994/03/01",10,"amet.lorem@lobortismaurisSuspendisse.org","SQO06MSM1IL","1"),("Steel","Wing","Brock","80.85785","81.15084","1998/10/29",6,"mauris.eu.elit@cursusNuncmauris.com","TMR14JAK6BM","1"),("Daryl","Raymond","Ferdinand","-9.69015","32.09016","2000/03/11",2,"tempor@hendreritneque.co.uk","KYB12WFK0BD","1"),("Alvin","Danielle","Jameson","-25.52947","-121.28493","1991/09/29",1,"mi.ac.mattis@Maurisvelturpis.co.uk","WXZ99FTI8OL","1"),("Calvin","Skyler","Fallon","-79.41589","64.40623","1990/05/02",4,"scelerisque.sed.sapien@duinec.net","QXR22NZM0TX","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Zeus","Pamela","Larissa","8.90362","-113.3638","1991/01/25",7,"porta.elit@temporbibendumDonec.com","NOY61OBW2QE","1"),("Fritz","Kelsie","Alika","57.34874","-16.82415","1997/06/18",7,"consectetuer.adipiscing.elit@nonsollicitudin.com","ESF32EPL0DT","1"),("Dale","Sylvia","Ethan","-61.70069","67.85229","1998/06/05",2,"enim.Nunc.ut@Integerid.org","VBN43KPO4XU","1"),("Lillith","Colton","Quinlan","-19.8373","114.41203","1987/06/23",9,"lacinia.mattis@vel.com","PGV89KUJ9EQ","1"),("Nasim","Slade","Cailin","-56.25154","-73.59109","1998/08/01",6,"vel.pede.blandit@parturientmontes.edu","JPO98COD6VA","1"),("Xanthus","Jordan","Adrian","-28.70333","87.08722","1987/09/20",3,"pede@etlibero.co.uk","PCZ96JYZ1DQ","1"),("Paki","Tyrone","Duncan","-66.80797","-38.53054","1997/08/02",10,"laoreet@pede.org","FHF94KQG8TB","1"),("Hedda","Cedric","Rae","-88.06127","-26.70539","2000/06/27",8,"erat.eget@loremac.net","KEZ87XAW5BW","1"),("Forrest","Benedict","Thor","-73.44603","150.33968","1995/12/22",3,"In@augueutlacus.net","JKQ50CBN5HR","1"),("Zena","Theodore","Noelle","36.75064","-51.99943","1995/06/11",3,"rutrum.magna.Cras@Donecnon.co.uk","JJE88GEA8UQ","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Thaddeus","Brenda","Winter","-58.07364","164.86128","1988/12/30",4,"nec.diam@rutrum.net","DLT52VDU7EI","1"),("Neville","Rajah","Xavier","-29.45129","-150.011","1997/01/10",1,"arcu@metuseu.ca","ALR70UPT7MB","1"),("Brennan","Edward","Dara","-51.04165","-167.50602","1995/02/21",1,"metus.Aliquam.erat@vehicula.com","JZC74UMN5VC","1"),("Wayne","Erich","Venus","-27.16633","-93.14931","1990/07/28",2,"Class@Quisque.com","DNI69DLG0KH","1"),("Oprah","Dale","Alvin","-60.17216","26.51351","1994/02/08",7,"Donec.dignissim@ligula.org","SMR68IPL2BO","1"),("Nigel","Cameron","Kirsten","69.12293","-34.79231","1994/05/08",7,"orci.Ut.sagittis@Donec.net","YZU87FZG4ZQ","1"),("Garrett","Noelani","Wyatt","32.4252","-13.37679","1996/05/21",8,"lorem@tempor.ca","BSQ54BOU1ZW","1"),("Beau","Violet","Uta","-27.14055","143.6209","1993/06/30",8,"sociis.natoque@iaculisodio.co.uk","MSR21ICA0GH","1"),("Xavier","Mara","Erich","27.54199","146.82641","1998/07/16",8,"ante@Nunc.com","XAF34HOB8LS","1"),("Hayley","Flavia","Nita","-82.68857","-3.19718","1988/03/25",7,"dignissim.tempor@et.net","YJO73VZK2ZC","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Kameko","Cailin","George","82.64365","83.86686","2000/03/19",6,"lorem.vehicula.et@ametlorem.net","IPK36LSK5JR","1"),("Ulysses","Leandra","Aurelia","-45.94919","64.35208","1993/11/04",10,"Donec.nibh.enim@quam.com","WJF88AFX3KG","1"),("Jolene","Jackson","Elvis","-41.28809","123.76786","1985/07/13",8,"mollis.nec@eu.net","QWQ36IQT4CL","1"),("Inez","Kitra","Ulric","20.83557","67.09581","1985/11/25",3,"fringilla.euismod@Cumsociisnatoque.net","DRY21FIE4TO","1"),("Davis","Sigourney","Tucker","-31.55975","-139.19267","1986/11/14",9,"ut@necenimNunc.ca","ZTV61DGZ0LR","1"),("Amos","Skyler","Byron","-74.58428","-53.92311","1988/02/13",6,"orci.consectetuer.euismod@elit.co.uk","VFC98FHC5VS","1"),("Lareina","Oren","Wang","-68.84055","89.33524","1989/12/16",3,"aliquet.vel.vulputate@tinciduntaliquam.co.uk","HKO96UOR0BA","1"),("Rogan","Aspen","Brianna","-57.92785","161.61564","1989/12/21",9,"neque.In.ornare@lobortis.org","PUW89QNZ4GB","1"),("Roanna","Scarlet","Elton","58.79715","55.55555","1997/12/28",6,"Donec.fringilla@eunibhvulputate.co.uk","EXZ46HDK1QX","1"),("George","Mara","Fritz","-1.44854","102.07486","1993/10/06",5,"ac@Mauris.net","MRW74HSS0XK","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Walter","Haley","Carter","44.19819","-88.57438","1994/05/07",5,"massa.Quisque.porttitor@vulputateeuodio.edu","HIR19RUG4LF","1"),("Tucker","Oliver","Todd","3.28256","-81.37983","1994/09/19",7,"mus@rutrum.org","IKX66FEZ6AS","1"),("Quon","Tiger","Bree","-40.7751","63.07743","1999/01/24",3,"interdum@nectellus.net","MBD21QFU4YF","1"),("Gray","Brent","Lester","-19.6603","117.1747","1996/11/02",1,"tempus.mauris@Pellentesqueultriciesdignissim.edu","MVQ27WZJ2TW","1"),("Roth","Barry","Aimee","30.31439","-155.9156","2000/02/14",6,"ullamcorper@Vivamuseuismodurna.co.uk","WYQ29UDN3UG","1"),("Kenyon","Darryl","Rahim","-60.05831","75.41622","1999/05/03",8,"lorem@habitantmorbitristique.co.uk","NSH17UKO4PQ","1"),("Colton","Silas","Kaye","-17.30669","-53.28695","1999/04/15",8,"dui.nec.urna@Praesenteudui.net","KMD20DGO3ZH","1"),("Sonya","Jasper","Joelle","59.34894","-135.61264","1993/10/05",10,"consequat@Duisac.org","SVJ15DLB8FS","1"),("Jerome","Kerry","Colin","-82.22446","-127.18176","1998/11/30",5,"ultricies.adipiscing@etmagnisdis.co.uk","NUV50QUS5RK","1"),("Hiram","Riley","Cameran","49.37819","-146.92319","1992/12/06",8,"dapibus.ligula@eget.co.uk","KUX98IEZ9EP","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Elton","Aurelia","Gil","-56.44948","50.95392","1994/02/10",8,"est.Mauris@ametfaucibus.com","CRA19GIQ8GT","1"),("Anastasia","Isabelle","Honorato","47.60433","164.78333","1999/08/29",8,"viverra.Donec@consequatdolor.co.uk","WXU76BKK6FI","1"),("Nita","Maxwell","Zachary","-20.90362","-9.14267","1999/11/24",3,"eget@erat.edu","ZLF43JAC0ZI","1"),("Sydnee","Declan","Jesse","26.20087","174.94941","1988/01/12",6,"in@Crassed.edu","AMP29KLC7NM","1"),("Cassidy","Sacha","Penelope","70.91732","1.94887","1985/10/14",2,"Vivamus.nibh@Vestibulum.com","MUW94KQK9WN","1"),("Fredericka","Isaac","Amanda","33.42242","-94.15764","1993/03/24",7,"tempor@feugiatnec.ca","IHF41WTA1IE","1"),("Hasad","Danielle","Genevieve","51.31405","-85.04215","1986/05/17",9,"est.ac@ipsumCurabitur.ca","YCS09RMS0YM","1"),("Barrett","Aphrodite","Oprah","-6.1393","-7.25554","1993/08/05",4,"pellentesque@mollisvitae.net","SQK26EOR6FK","1"),("Marvin","Elton","Sara","30.72816","-29.21069","1999/11/22",1,"mi.lacinia@maurissapien.ca","BOZ07TXW3DD","1"),("Tate","Arthur","Phyllis","-6.60921","110.71838","1995/01/23",3,"sapien.Aenean@atsem.ca","QNP54PJD7KW","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Alexander","Keegan","Lawrence","78.17796","154.3814","1988/06/23",4,"ligula.elit.pretium@nonummyutmolestie.ca","OQC13JZU1JP","1"),("Kato","Clinton","Uta","-33.31791","124.68023","1990/08/28",1,"augue.porttitor@vitaeerat.co.uk","KAC39FAV7TC","1"),("Urielle","Amela","Keane","83.42694","-101.12811","1997/06/17",3,"scelerisque.mollis.Phasellus@sodalesnisi.net","CZR46QQB6ML","1"),("Kiayada","Guy","Amaya","44.71997","131.16958","1996/05/29",1,"pulvinar.arcu@auguescelerisque.co.uk","KLD67XBF8LR","1"),("Leo","Elijah","Lavinia","37.67115","115.62808","1987/08/19",1,"fermentum.metus@velnisl.ca","LEZ55DXQ7ZG","1"),("Walker","Mechelle","Glenna","-44.87786","133.62556","1995/10/07",8,"tincidunt.nunc.ac@natoquepenatibuset.com","NRW64VGJ3VW","1"),("Chantale","Eden","Jaden","-26.73971","12.56736","1998/09/18",2,"Proin.ultrices@anteipsumprimis.com","TCO65DIJ5RW","1"),("Jena","Tanek","Porter","-12.44116","54.73456","1990/10/21",4,"nisi.sem@lacinia.org","SOY92WUK3AN","1"),("Ishmael","Dahlia","Wyatt","88.89988","-128.24659","2000/02/07",7,"augue.Sed.molestie@metusfacilisislorem.edu","TAG52TZN5BS","1"),("Myra","Joel","Athena","70.95305","82.64393","1992/04/23",7,"fringilla@gravidasagittis.edu","HAF00ZHI6XT","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Malik","Amal","Amery","53.40334","-115.16403","1986/01/15",10,"eget@Suspendisse.com","MGB79JPP7RY","1"),("Hadley","Jarrod","Cole","-47.87332","3.89919","1989/02/16",5,"accumsan.neque.et@nequeetnunc.ca","YQY93BLV1MS","1"),("Drew","Chaim","Nigel","-78.32018","77.44672","1999/12/08",8,"tristique@venenatislacusEtiam.org","ATR95VRY2PP","1"),("Rama","Liberty","Tanner","-4.60504","59.92265","1995/10/01",10,"in@arcuCurabiturut.com","LXD22OWM0PK","1"),("Zephr","Tatyana","Sebastian","-11.24568","-117.96139","1998/01/18",5,"a@sed.com","MNI66SAL8JT","1"),("Thaddeus","Rina","Lee","-37.15865","-146.06064","1989/12/13",8,"a@consectetuer.com","DKF21RJL5YT","1"),("Shad","Troy","George","-9.20378","-101.77934","1988/01/13",2,"semper@Integeraliquamadipiscing.ca","UOU06LWH6QM","1"),("Althea","Imani","Stephanie","-65.98061","-57.08235","1987/09/29",1,"eu.dolor@eudoloregestas.net","QQB57TXG7PB","1"),("Xavier","Griffith","Ray","11.93623","149.86831","1997/03/12",5,"at@tristiqueac.com","LIV46AIL1ZS","1"),("Kenyon","Dara","Hanae","-52.3301","-24.16676","1989/08/23",5,"at.auctor.ullamcorper@vulputateeuodio.ca","DNR75PBE4PB","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Slade","Victor","Winifred","-8.84488","0.67032","1993/08/07",8,"neque@liberoest.co.uk","ZMR17NBS5VH","1"),("Donovan","Kelly","Marshall","1.2242","-84.14085","2000/01/26",1,"elit.fermentum.risus@mattisornare.co.uk","VMX76RVZ5LU","1"),("Quin","Francis","Kirestin","-67.84454","13.98009","1995/11/06",9,"quis.pede.Suspendisse@non.edu","RLD00IHL0OY","1"),("Kareem","Sasha","Fitzgerald","-68.94998","-50.69613","1992/07/08",7,"sed.orci@metusvitae.ca","KPS35JVT7SW","1"),("Dale","Lael","Shannon","23.86583","14.05366","1989/04/03",5,"rutrum@nullaanteiaculis.org","IYQ36NYH0EM","1"),("Merrill","Addison","Thor","41.61618","81.74288","1988/09/09",6,"Aliquam.vulputate.ullamcorper@uteros.edu","ZQN51IVS7CO","1"),("Hamilton","Richard","Raphael","-45.18281","-40.49434","1998/01/29",6,"Curabitur.sed@eget.net","JIG24IGU4FB","1"),("Jason","Nathaniel","Ocean","58.33522","72.11489","1986/01/13",2,"in.faucibus@Sed.org","FEF28UQY9JJ","1"),("Quinn","Quinlan","Leila","20.39435","41.08892","1985/08/11",6,"Nunc@tellusAenean.com","JEE78CTY8DQ","1"),("Zorita","Duncan","Ethan","-74.11783","1.17918","1986/11/03",8,"Nullam@nullavulputatedui.com","WGQ94OTF5BJ","1");
INSERT INTO `userinfor` (`username`,`firstname`,`lastname`,`latitude`,`longitude`,`date_of_birth`,`score`,`email`,`password`,`verified`) VALUES ("Emerald","Maxwell","Rose","81.52153","-160.87594","1997/07/13",1,"egestas.a@nibh.net","XXL59GNA1MB","1"),("Alexander","Nissim","Dalton","-56.64515","-39.14146","1990/10/07",1,"Ut@egetmagna.edu","XZB96UJM5LR","1"),("Tatyana","Clinton","Isaac","85.28144","126.96213","1998/12/06",5,"dolor.Nulla.semper@loremsitamet.ca","LUV34DPF7UI","1"),("Darius","Uriel","Hyacinth","6.94744","163.29895","1997/08/10",4,"condimentum.eget@leoinlobortis.net","CXF65XKC5LH","1"),("Lana","Juliet","Axel","-33.03685","99.59292","1996/07/17",10,"magnis@sapienimperdiet.ca","LLE53ANG1BC","1"),("Shafira","Honorato","Finn","-40.00279","-173.26468","1995/03/31",6,"quam@ultrices.ca","YJP08AEL5WO","1"),("Karly","Paki","Irene","60.19848","-54.69753","1987/02/19",7,"est.Mauris.eu@interdum.net","RLJ12KDC4TL","1"),("Rhea","Raphael","Rebekah","-6.352","-59.65232","1992/02/02",1,"molestie.Sed@sit.edu","CAY74TLR4PA","1"),("Dante","Alvin","Caleb","4.96967","138.79195","1988/05/22",3,"ridiculus.mus.Proin@sed.net","BUH72HTT3OM","1"),("Shay","Gary","Daniel","52.9333","-123.67826","1988/11/30",7,"eu.dui@amet.edu","BXA19GDP2SA","1");