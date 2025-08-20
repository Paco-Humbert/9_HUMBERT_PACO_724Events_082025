import { useState, useEffect, useMemo } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // Filtre d'abord 
  const allEvents = data?.events ?? [];
  const filtered = useMemo(
    () => (type ? allEvents.filter((e) => e.type === type) : allEvents),
    [allEvents, type]
  );

  // Pages totales (sur le filtré, pas sur la page courante)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  // Borner la page si le filtre change / taille change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Découper APRÈS filtrage
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  // Liste des types (depuis toutes les données)
  const typeList = useMemo(
    () => Array.from(new Set(allEvents.map((e) => e.type))),
    [allEvents]
  );

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType || undefined);
  };

  if (error) return <div>An error occured</div>;
  if (data === null) return "loading";

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList}
        onChange={(value) => changeType(value)}
      />

      <div id="events" className="ListContainer">
        {pageItems.map((event) => (
          <Modal key={`${event.id}-${event.cover}`} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>

      <div className="Pagination">
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          return (
            <a
              key={page}
              href="#events"
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={page === currentPage ? "is-active" : ""}
            >
              {page}
            </a>
          );
        })}
      </div>
    </>
  );
};

export default EventList;
