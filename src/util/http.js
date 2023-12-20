import { QueryClient } from "@tanstack/react-query";

// instantiate a new Query Client
// and allow to be exportable to other files
export const queryClient = new QueryClient();

// we make the parameter an object, and as a second property we use searchTerm
export async function fetchEvents({ signal, searchTerm }) {
  // log to see the object passed by TanStack Query to the queryFn
  console.log("searchTerm:", searchTerm);

  let url = "http://localhost:4000/events";

  // we add a way to dynamically append the url with the searchTerm
  if (searchTerm) {
    url += "?search=" + searchTerm;
  }

  // we can pass the signal coming from the TanStack QueryFn Object to the fetch so the browser can cancel it
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:4000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectableImages({ signal }) {
  const response = await fetch(`http://localhost:4000/events/images`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the images");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}
