export default function ProductDescription({ product }) {
  // Check if the product and description exist before rendering
  if (!product || !product.description) {
    return <p>Product description is not available.</p>;
  }

  // A helper function to parse the structured description text.

  const parseDescription = (text) => {
    // Split the text into sections based on headings
    const sections = text.split(
      /(Types:|Growth:|Nutritional Value:|Global Importance:|History:|Culinary Uses:|Growing Conditions:|Potential Health Benefits:|Allergies:|Bangladesh:)/
    );

    // The first part is the main description
    const mainDescription = sections[0].trim();

    // The rest of the sections are key-value pairs
    const details = {};
    for (let i = 1; i < sections.length; i += 2) {
      const heading = sections[i].replace(/:$/, "").trim();
      const content = sections[i + 1].trim();
      details[heading] = content;
    }

    return { mainDescription, details };
  };

  const { mainDescription, details } = parseDescription(product.description);

  return (
    <div className="py-8">
      <div className="prose prose-lg max-w-none dark:prose-invert text-white">
        <h3>About This Product</h3>
        <p>{mainDescription}</p>

        {Object.entries(details).map(([key, value]) => (
          <div key={key}>
            <h4>{key}</h4>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
