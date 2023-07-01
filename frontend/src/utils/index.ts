export function reloadPage(location: string) {
  setTimeout(() => {
    window.location.href = location;
  }, 1000);
}

export function getHeaders() {
  return {
    "x-access-token": localStorage.getItem("token") || "",
  };
}
