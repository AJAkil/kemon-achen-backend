exports.paginate = schema => {
  schema.statics.paginate = async function (filter, options) {
    const { sortBy, select, populate } = options;

    console.log(sortBy);
    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).populate(populate).sort(sortBy).lean();

    const page = Number(options.page || 0);
    const limit = Number(options.limit || 10);
    const all = options.page === undefined || options.limit === undefined;

    if (!all) {
      docsPromise = docsPromise.skip(page * limit).limit(limit);
    }

    if (select) {
      docsPromise = docsPromise.select(select);
    }

    docsPromise = docsPromise.exec();

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromise,
    ]);
    const totalPages = all ? -1 : Math.ceil(totalResults / limit);

    return {
      results,
      page: all ? -1 : page,
      limit: all ? -1 : limit,
      totalPages,
      totalResults,
    };
  };
};
