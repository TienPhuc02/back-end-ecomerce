export class APIFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
      this.query = this?.query?.find({ ...keyword });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //field to remove
    const fieldsToRemove = ["keyword", "currentPage", "pageSize"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    //filter advance  for price,ratings,etc

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // "gt" (lớn hơn), "gte" (lớn hơn hoặc bằng), "lt" (nhỏ hơn), và "lte" (nhỏ hơn hoặc bằng).
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination() {
    const pageSize = Number(this.queryStr.pageSize);
    const currentPage = Number(this.queryStr.currentPage);
    const skip = pageSize * (currentPage - 1);
    this.query = this.query.limit(pageSize).skip(skip);
    return this;
  }
}
