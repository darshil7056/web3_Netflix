//getMyMovieList
Moralis.Cloud.define("myDataArray", async (request) => {
  const addrs = request.params.addrs;
  const user = Moralis.Object.extend("_User");
  const query = new Moralis.Query(user);
  query.equalTo("ethAddress", addrs);

  const data = await query.first({ useMasterKey: true });

  if (data.attributes.myArray) {
    return data.attributes.myArray;
  } else {
    return [];
  }
});

//setMyMovieList

Moralis.Cloud.define("setDataArray", async (request) => {
  const addrs = request.params.addrs;
  const newFav = request.params.newFav;
  const user = Moralis.Object.extend("_User");
  const query = new Moralis.Query(user);
  query.equalTo("ethAddress", addrs);

  const data = await query.first({ useMasterKey: true });

  if (data.attributes.myArray) {
    const { myArray } = data.attributes;
    myArray.push(newFav);
    data.set("myArray", myArray);
  } else {
    data.set("myArray", [newFav]);
  }
  await data.save(null, { useMasterKey: true });
});
