export function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}

export const printFormData = (formData: FormData) => {
  console.log("printing form data");
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
  console.log("end form data");
};
