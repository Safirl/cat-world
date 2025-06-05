import NavBar from "./components/Navbar";

const Mentions = () => {
    return <>
        <NavBar />
        <h1>Mentions légales</h1>
        <h4>Propriétaires du site</h4>
        <span>Noms des éditeurs : Loïc Leforestier, Héloïse Pingintore</span>
        <span>Email : loicleforestier.pro@gmail.com</span>
        <span>Directeur de la publication : Loïc Leforestier</span>
        <h4>Hébergeur</h4>
        <span>Le site est hébergé par : Scalingo SAS
            13 rue Jacques Peirotes
            67000 Strasbourg
            France
            SIRET 80866548300018
        </span>
        <h4>Propriété intellectuelle</h4>
        <span>
            L'ensemble du contenu du site (textes, images, vidéos, logos, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou diffusion sans autorisation est interdite.
        </span>
        <h4>Utilisation des données personnelles</h4>
        <span>
            Le site Catworld utilise des cookies pour son bon fonctionnement. En vous créant un compte, vous acceptez l'utilisation de ces cookies à des fins non commerciales. Les données collectées sont les suivantes :
            - Adresse mail utilisée pour la connexion
            - Pseudonyme
            Ces données sont stockées sur les serveurs de l'hébergeur mentionné précedemment.
            En aucun cas ces données ne sont utilisées à des fins commerciales.
        </span>
    </>
}

export default Mentions;