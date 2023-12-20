import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient, fetchEvent, deleteEvent } from "../../util/http.js";

export default function EventDetails() {
  // get the individual Event id from the url parameters
  const { id } = useParams();

  const navigate = useNavigate();

  // useQuery for fetching the individual Event
  const { data, isPending, isError, error } = useQuery({
    // make a query key
    queryKey: ["events", id],
    // define the query function, passing along signal
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  // useMutation for deleting the individual Event
  const { mutate } = useMutation({
    // use the deleteEvent function
    mutationFn: deleteEvent,
    onSuccess: () => {
      // invalidate the "events" query key
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // navigate back to /events
      navigate("/events");
    },
  });

  const handleDelete = () => {
    // call the mutate function and pass it the event id
    mutate({ id });
  };

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && <p>Fetching event details...</p>}
      {isError && (
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Failed to fetch event data, please try again"
          }
        />
      )}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleDelete}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:4000/${data.image}`} alt="" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.date} @ {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
