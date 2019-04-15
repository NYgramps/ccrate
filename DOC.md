When viewed in a browser, *ccrate.html* provides a web page to compute **continously compounded rates** for financial investments having credits and debits, that is, a *flow* over time, e.g. tax-deferred retirement accounts requiring withdrawals (RMDs) after the age of 70.5.  The equation used to define this type of rate, *r*, over a single flow period is

<p align="center">
<i>value = principal &#215; e<sup>rt</sup></i>
</p>

where *principal* is the investment value at the beginning of the period, and *value* is the investment value after *t* years.  In this case, *r* has a closed form solution in terms of the natural
logarithm of calculus.

Next consider the case of 2 flow amounts, *f[1]* occurring on date *d[1]*
preceding *f[2]* occurring on date *d[2]*.  Denoting the time intervals
*t[1]* = [*d[1]*, *d[2]*] and *t[2]* = [*d[2]*, *D*], and *V* the investment
value on *D*, it follows that

<p align="center">   
<i>V = ( f[1] e<sup>rt[1]</sup> + f[2] ) e<sup>rt[2]</sup> = f[1] e<sup>r(t[1] + t[2])</sup> + f[2] e<sup>rt[2]</sup></i>.
</p>

Note that *t[1] + t[2]* is the time interval [*d[1]*, *D*].  More generally, if there is a sequence of flow amounts, *{f[i]}*, occurring on the dates, *{d[i]}*, for *i=1,...,I*,
the above equation becomes

<p align="center">
<a href="https://www.codecogs.com/eqnedit.php?latex=\fn_cm&space;V&space;=&space;\sum_{i=1}^{I}f[i]e^{ry[i]}" target="_blank"><img src="https://latex.codecogs.com/png.latex?\fn_cm&space;V&space;=&space;\sum_{i=1}^{I}f[i]e^{ry[i]}" title="V = \sum_{i=1}^{I}f[i]e^{ry[i]}" /></a>
</p>

where *y[i]* equals the time interval [*d[i], D*] in years.  Although there is no closed-form solution for *r*, the *Newton-Raphson* numerical method can be used to generate successively improving appoximations of the root of

<p align="center">
<a href="https://www.codecogs.com/eqnedit.php?latex=\fn_cm&space;g(r)&space;=&space;\sum_{i=1}^{I}f[i]e^{ry[i]}&space;-&space;V" target="_blank"><img src="https://latex.codecogs.com/png.latex?\fn_cm&space;g(r)&space;=&space;\sum_{i=1}^{I}f[i]e^{ry[i]}&space;-&space;V" title="g(r) = \sum_{i=1}^{I}f[i]e^{ry[i]} - V" /></a>
</p>

to a high degree of accuracy after only a few iterations of the formula

<p align="center">
<a href="https://www.codecogs.com/eqnedit.php?latex=\fn_cm&space;r_{n&plus;1}&space;=&space;r_{n}&space;-&space;\frac{g(r_{n})}{g\prime(r_{n})}," target="_blank"><img src="https://latex.codecogs.com/png.latex?\fn_cm&space;r_{n&plus;1}&space;=&space;r_{n}&space;-&space;\frac{g(r_{n})}{g\prime(r_{n})}," title="r_{n+1} = r_{n} - \frac{g(r_{n})}{g\prime(r_{n})}," /></a>
</p>

initializing *r*<sub>1</sub> with a guess of the root value, and *g&prime;(r)* denoting the *derivative* of *g(r)*.

So a **continuously compounded rate**, denoted **_ccrate_**, is yet another measure of the performance of such an investment over its lifetime, accounting for all deposits and withdrawals.  Indeed, even maintenance and/or advisory fees would be accounted for implicitly for certain types of financial investments dependent on market value. **_ccrate_** can be thought of as a relative of the usual concept of interest rate.  It is a very good appoximation of interest rates compounded with at least a monthly frequency, and is easier to work with because it is defined in terms of the standard exponential
function of calculus, <i>exp()</i>, which has many nice mathematical properties.

