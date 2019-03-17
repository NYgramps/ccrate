The file **ccrate.html** is a GUI used to obtain the beginning and ending of a time interval, from the user,
over which the **_continuously compounded rate_**,  aka *ccrate*, is computed for an
underlying financial account (see **DOC.md** for a discussion of this rate and simple model developed for its computation). The account's transaction history is stored in a **csv** file, making for easy editing by the user via any modern spreadsheet program.  The transactions contained in the **csv** file, and the
values computed by the algorithm which converge to *ccrate*, can be viewed in the web console of the browser; in addition, a *perl* script, **ccrate.pl**, is provided for interested parties, such as developers, which performs the same calculation.  Because
the *html* file is static, it can be bookmarked in the browser for easy access and use 
in the future.  It is supported by plain vanilla *javascript* and *css* and works offline.
