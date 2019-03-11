#!/usr/bin/env perl

use strict;
use Carp;
use IO::File;
use Getopt::Long;
use Time::Local;
use Pod::Usage;
use v5.10;

exit(main());

        # # # # # # # # # # # # # # # # # # # # # # # # # # #

sub main
  {
  my $usage_opt = {-msg => "\nenter 'perldoc $0' to see documentation\n",
                   -exitval => 0,
                   -verbose => 99,
                   -sections => [qw(USAGE DESCRIPTION)]};

  my ($enddate, $endamt, $infile, $IN);
  GetOptions('d=s' => \$enddate, 'a=s' => \$endamt, 'f=s' => \$infile);
  datecheck($enddate, $usage_opt);
  amtcheck($endamt, $usage_opt);
  unless ($IN = IO::File->new($infile, '<'))
    {
    carp("cannot read from $infile");
    pod2usage($usage_opt);
    }

  my (@dates, @flow, @yrs);
  while (my $rec = $IN->getline())
    {
    chomp($rec);
    next unless ($rec =~ /^\d{8},/);
    my ($date, $amt) = split(/,/, $rec);
    datecheck($date, $usage_opt);
    amtcheck($amt, $usage_opt);
    next if ($date >= $enddate);
    push(@dates, $date);
    push(@flow, $amt);
    }
  $IN->close();

  my $ref = diffdays($enddate);
  for (my $i=0; $i<scalar(@dates); $i++)
    {
    $yrs[$i] = $ref->($dates[$i])/365.25;
    say "$i: flow = $flow[$i]   yrs = $yrs[$i]";
    }

#
#   Newton-Raphson algorithm
#
  my $tol = 1.e-08;
  my ($new, $old, $iter) = ($tol*10, 0, 0);
  while (abs($new - $old) > $tol)
    {
    $old = $new;
    my ($f, $df) = continuous_compounding($old, \@flow, \@yrs);
    $f -= $endamt;
    $new = $old - ($f/$df);
    $iter++;
    say "$iter   old = $old   new = $new";
    croak("check data...should have converged by now") if ($iter == 1000);
    }

  my $rate = sprintf("%.3f", $new*100).'%';
  say "\nccrate = $rate\n";

  return(0);
  }

        # # # # # # # # # # # # # # # # # # # # # # # # # # #

sub datecheck
  {
  my ($date, $ref) = @_;
  return if ($date =~ /^\d{8}$/);
  carp("dates must be formatted as yyyymmdd");
  pod2usage($ref);
  }

        # # # # # # # # # # # # # # # # # # # # # # # # # # #

sub amtcheck
  {
  my ($amt, $ref) = @_;
  return if ($amt =~ /^[+-]?\d+\.?\d*$/);
  carp("amounts can only contain digits (1 or more), ".
       "and optionally '+', '-', '.'");
  pod2usage($ref);
  }

        # # # # # # # # # # # # # # # # # # # # # # # # # # #

sub diffdays
  {
  my $post = shift;
  my($yyyy, $mm, $dd) = ($post =~ /(\d{4})(\d{2})(\d{2})/);
  my $postsec = timelocal(0,0,0,$dd,$mm-1,$yyyy-1900);

  return sub
    {
    my $pre = shift;
    ($yyyy, $mm, $dd) = ($pre =~ /(\d{4})(\d{2})(\d{2})/);
    my $presec = timelocal(0,0,0,$dd,$mm-1,$yyyy-1900);
    my $days = ($postsec - $presec)/(60*60*24);
    return($days);
    }
  }

        # # # # # # # # # # # # # # # # # # # # # # # # # # #

sub continuous_compounding
  {
  my ($x, $flow, $yrs) = @_;

  my ($f,$df) = (0,0);
  for (my $i=0; $i<scalar(@{$flow}); $i++)
    {
    my $tmp = $flow->[$i]*exp($x*$yrs->[$i]);
    $f += $tmp;
    $df += $yrs->[$i]*$tmp;
    }

  return ($f,$df);
  }

__END__

=pod

=head1 USAGE

ccrate.pl  --a <end amount>  --d <end date>  --f <input file of flows>

where the financial instrument has a value of 'end amount' on
'end date', the date of interest, and each record of the input file
consists of two data fields : 'date' and 'flow';
record chronology is irrelevant. If the flow
is a credit, a '+' prefix is optional; a debit must have a minus '-' prefix;
both are real numbers, without any commas.

=head1 DESCRIPTION

This script computes the continuously compounded interest rate of an investment
with a value of 'end amount' on 'end date'.

=cut
