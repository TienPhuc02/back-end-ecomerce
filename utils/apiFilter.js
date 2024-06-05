import aqp from "api-query-params";

class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    console.log("keyword", this.queryStr.keyword);
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    const queryCopy = { ...this.queryStr };

    // Fields to remove
    const fieldsToRemove = ["keyword", "page", "pageSize", "currentPage"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    // Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination() {
    try {
      console.log("check queryStr", this.queryStr);
      console.log("current page ", this.queryStr.currentPage);
      console.log(" page size", this.queryStr.pageSize);
      let offSet = (this.queryStr.currentPage - 1) * this.queryStr.pageSize;
      this.query = this.query.limit(this.queryStr.pageSize).skip(offSet);
      return this;
    } catch (error) {
      console.log("error", error);
    }
  }
}

export default APIFilters;
