export default function ProductDescription() {
  return (
    <div className="py-8">
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h3>About This Product</h3>
        <p>
          Our fresh, organic tomatoes are grown with care in the fertile
          soils of Sylhet. These vine-ripened tomatoes are picked at peak
          freshness and delivered within 24 hours of harvest to ensure
          maximum flavor and nutritional value.
        </p>

        <h4>Key Features:</h4>
        <ul>
          <li>100% Organic - No pesticides or chemical fertilizers</li>
          <li>Vine-ripened for optimal taste and nutrition</li>
          <li>Harvested within 24 hours of delivery</li>
          <li>Rich in vitamins C, K, and antioxidants</li>
          <li>Perfect for salads, cooking, and sauces</li>
        </ul>

        <h4>Storage Instructions:</h4>
        <p>
          Store at room temperature for best flavor. Refrigerate only when
          fully ripe to extend shelf life. Use within 5-7 days for optimal
          freshness.
        </p>

        <h4>Nutritional Information (per 100g):</h4>
        <ul>
          <li>Calories: 18</li>
          <li>Vitamin C: 14mg</li>
          <li>Potassium: 237mg</li>
          <li>Folate: 15mcg</li>
        </ul>
      </div>
    </div>
  );
}