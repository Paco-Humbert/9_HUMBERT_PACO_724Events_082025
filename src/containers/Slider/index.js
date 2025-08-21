import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import "./style.scss";

// Parse robuste d'une date (accepte "YYYY-MM-DD" et ISO)
const parseDate = (raw) => {
  let t = Date.parse(raw);
  if (!Number.isFinite(t)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) t = Date.parse(`${raw}T00:00:00Z`);
  }
  return Number.isFinite(t) ? new Date(t) : null;
};

// Mois FR (garde-fou si date invalide)
const monthFR = (date) =>
  date ? date.toLocaleString("fr-FR", { month: "long" }).toUpperCase() : "";

const Slider = () => {
  const { data } = useData();

  // Nettoyage + tri descendant + ne garder que 3 items
  const items = (data?.focus ?? [])
    .map((e) => {
      const parsedDate = parseDate(e.date);
      return parsedDate ? { ...e, parsedDate } : null; // on drop si date invalide
    })
    .filter(Boolean)
    .sort((a, b) => b.parsedDate - a.parsedDate)
    .slice(0, 3);

  const [index, setIndex] = useState(0);

  // Si la longueur change, garder un index valide
  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  // Auto-advance propre
  useEffect(() => {
    if (items.length === 0) return () => {};
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearTimeout(id);
  }, [index, items.length]);

  return (
    // React.Fragment sert à grouper plusieurs éléments sans créer de balise <div> supplémentaire.
    // Ici il est utilisé pour pouvoir mettre une "key" sur l'élément retourné par le .map().
    <div className="SlideCardList">
      {items.map((event, idx) => (
        <React.Fragment key={event.id || event.title}>
          <div className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
            <img src={event.cover} alt={event.title || "visuel"} />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{monthFR(event.parsedDate)}</div>
              </div>
            </div>
          </div>
        </React.Fragment>
      // Ajout de la fermeture du premier ".map"
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {items.map((event, radioIdx) => (
          // {byDateDesc.map((_, radioIdx)
            <input
              key={`radio-${event.id || radioIdx}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              // checked={idx === radioIdx} correction idx => index
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
