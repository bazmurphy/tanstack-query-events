import { useQuery } from "@tanstack/react-query"; // import TanStack Query

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";

import { fetchEvents } from "../../util/http.js"; // import fetchEvents

export default function NewEventsSection() {
  // useQuery Hook and destructuring the relevant properties
  const { data, isPending, isError, error } = useQuery({
    // provide a Query Function
    queryFn: fetchEvents,
    // define a Query Key
    queryKey: ["events"],
    // Stale Time : wait for 5000 milliseconds before sending another request
    // staleTime: 5000,
    // Garbage Collection Time: how long the cache will be kept
    // gcTime: 30000,
  });

  let content;

  // isPending from useQuery
  if (isPending) {
    content = <LoadingIndicator />;
  }

  // isError from useQuery
  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        // use the error message from the fetchEvents
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  // data from useQuery
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
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
