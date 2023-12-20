import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "../Events/EventItem";

export default function FindEventSection() {
  // we use ref to get the value of the search input
  const searchElement = useRef();

  // we create state to store the searchTerm
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, isError, error } = useQuery({
    // we create a dynamic Query Key
    queryKey: ["events", { search: searchTerm }],
    // we use an anonymous arrow function to call fetchEvents and pass it the searchTerm
    // that anonymous arrow function recieves an object from TanStack Query and we can pass on some of its properties to the fetchEvents
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
  });

  function handleSubmit(event) {
    event.preventDefault();
    // we update the searchTerm on submit of the form
    setSearchTerm(searchElement.current.value);
  }

  // set an initial content value
  let content = <p>Please enter a search term and to find events.</p>;

  // content will adjust dynamically based on the useQuery

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
