/*global d3,marked*/

var a_afficher = function(d, p, s) {
    var affiche_semestre = (s == "tous") || (s == d.semestre),
        affiche_parcours = (Array.isArray(d.parcours)) || (d.parcours == p);
    return (affiche_semestre && affiche_parcours) ? "inline-block" : "none";
}

/* CHOIX DU PARCOURS : EMS par défaut */
d3.select("#choix_parcours").selectAll("button")
    .data(["EMS", "VCOD"])
    .enter()
    .append("button")
    .attr("class", function(d) { return d == "EMS" ? "selected" : ""})
    .html(function(d) { return d; })
    .on("click",function() {
        var p = d3.select(this).data()[0],
            s = d3.select("#choix_semestre").selectAll(".selected").data()[0];
        d3.select("#choix_parcours").selectAll("button").attr("class", "")
        d3.select(this).attr("class", "selected")
        d3.select("#choix_fiche").selectAll("button").classed("selected", false)
        d3.select("#fiche").html("")
        d3.select("#choix_fiche").selectAll(".bouton")
            .each(function() {
                d3.select(this).style("display", function(d) { return a_afficher(d, p, s); })
            })
})

/* CHOIX DES SEMESTRES */
d3.select("#choix_semestre").selectAll("button")
    .data(["tous", 1, 2, 3, 4, 5, 6])
    .enter()
    .append("button")
    .attr("class", function(d) { return d == "tous" ? "selected" : ""})
    .html(function(d) { return d; })
    .on("click", function() {
        var p = d3.select("#choix_parcours").selectAll(".selected").data()[0],
            s = d3.select(this).data()[0];
        d3.select("#choix_semestre").selectAll("button").attr("class", "")
        d3.select(this).attr("class", "selected")
        d3.select("#choix_fiche").selectAll("button").classed("selected", false)
        d3.select("#fiche").html("")
        d3.select("#choix_fiche").selectAll(".bouton")
            .each(function() {
                d3.select(this).style("display", function(d) { return a_afficher(d, p, s); })
            })
})

var creation = function(but) {
    d3.select("#choix_fiche").selectAll(".bouton")
        .data(but)
        .enter()
        .append("button")
        .attr("class", function(d) { return "bouton " + d.type; })
        .style("display", function(d) {
            if (Array.isArray(d.parcours))
                        return "inline-block"
                    else
                        return d.parcours == "EMS" ? "inline-block" : "none";
            })
        .html(function(d) { return d.numero_long; })
        .on("click", function() {
            var d = d3.select(this).data()[0]
            d3.select("#choix_fiche").selectAll("button").classed("selected", false)
            d3.select(this).classed("selected", true)  
            // d3.select("#fiche").html("<h2>" + d.libelle + "</h2>" + "<pre>" + d.texte + "</pre>");
            d3.select("#fiche").html("<h2>" + d.libelle + "</h2>" + marked.parse(d.texte));
        });
    
}

d3.json("but-sd.json")
    .then(creation);
