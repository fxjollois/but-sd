composantes_essentielles = function(comp) {
    var res = d3.create("div")
        .attr("class", "composante");
    res.append("h3").html(comp["@libelle_long"]);
    res.append("h4").html("Composantes essentielles");
    res.append("ul").selectAll("li")
        .data(comp.composantes_essentielles.composante)
        .enter()
        .append("li")
        .html(d => d);
    return(res.node());
}

niveaux = function(niv) {
    var res = d3.create("div")
        .attr("class", "niveau");
    res.append("h5").html(niv["@annee"] + " : " + niv["@libelle"]);
    res.append("ul").selectAll("li")
        .data(niv.acs.ac)
        .enter()
        .append("li")
        .html(d => d["@code"] + " : " + d["#text"])
    return(res.node());
}

affiche_competence = function(m, comp) {
    var res = d3.select("#corps").append("div")
        .attr("class", "competence bg-secondary")
        .on("click", remove);
    res.append("h3").html(comp["@libelle_long"]);
    res.append("p").html(comp["@nom_court"]);
    res.append("h4").html("Niveaux (et Apprentissages critiques)");
    res.selectAll(".niveau")
        .data(comp.niveaux.niveau)
        .enter()
        .append(d => niveaux(d))
    res.append("p").append("em").html("Cliquer sur la fenêtre pour la fermer")
}

remove = function(m, d) { d3.select(this).remove(); }

d3.json("pn.json").then(function(data){
    communes = d3.select("#competences_communes");
    communes.append("div").attr("class", "row").selectAll("div")
        .data(data.referentiel_competence.competences.competence.slice(0, 3))
        .enter()
        .append("div")
        .attr("class", "col-sm")
        .append(d => composantes_essentielles(d))
        .on("click", affiche_competence);
    
    specifiques = d3.select("#competences_specifiques");
    specifiques.append("div").attr("class", "row").selectAll("div")
        .data(data.referentiel_competence.competences.competence.slice(3, 5))
        .enter()
        .append("div")
        .attr("class", "col-sm")
        .append(d => composantes_essentielles(d))
        .on("click", affiche_competence);
});
